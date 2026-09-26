import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import {
  getProjectFiles,
  getProjectFileById,
  createProjectFile,
  deleteProjectFile,
  getOrderById,
} from '@/lib/db'
import { notifyOwners, sendClientEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

const ALLOWED_MIME_PREFIXES = [
  'image/',
  'application/pdf',
  'text/',
  'application/json',
  'application/zip',
  'application/x-zip-compressed',
  'application/msword',
  'application/vnd.openxmlformats-officedocument',
]

const MAX_FILE_BYTES = 4.5 * 1024 * 1024 // 4.5MB safe base64 payload limit

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId') || undefined
    const fileId = searchParams.get('fileId') || undefined

    if (fileId) {
      const file = await getProjectFileById(fileId)
      if (!file) {
        return NextResponse.json({ success: false, error: 'File not found.' }, { status: 404 })
      }
      if (user.role !== 'admin' && file.userId !== user.id) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }
      return NextResponse.json({ success: true, file })
    }

    const rawFiles =
      user.role === 'admin'
        ? await getProjectFiles(orderId ? { orderId } : undefined)
        : await getProjectFiles({ userId: user.id, orderId })

    // Map fields so both uploaderRole and uploadedByRole / dataUrl work seamlessly in UI
    const files = rawFiles.map((f) => ({
      ...f,
      uploadedByRole: f.uploaderRole === 'admin' ? 'owner' : 'client',
      uploadedByName: f.uploaderName,
      dataUrl: f.contentBase64,
    }))

    return NextResponse.json({ success: true, files })
  } catch (err: any) {
    console.error('[Files GET API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to load files.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      orderId,
      targetUserId,
      fileName,
      fileType,
      fileSize,
      category = 'client_asset',
      dataUrl,
      notes,
    } = body

    if (!fileName || !dataUrl) {
      return NextResponse.json(
        { success: false, error: 'File name and file content are required.' },
        { status: 400 }
      )
    }

    if (Number(fileSize) > MAX_FILE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds the 4.5MB security limit.' },
        { status: 400 }
      )
    }

    const isAllowedType = ALLOWED_MIME_PREFIXES.some((prefix) =>
      String(fileType || 'application/octet-stream').toLowerCase().startsWith(prefix)
    )
    if (!isAllowedType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unsupported file type. Allowed formats: PDF, Images, TXT/MD, JSON, ZIP, DOC/DOCX.',
        },
        { status: 400 }
      )
    }

    let resolvedUserId = user.id
    let resolvedOrderId = orderId || 'general_workspace'
    let orderNumber = 'General Workspace'

    if (orderId) {
      const order = await getOrderById(orderId)
      if (!order) {
        return NextResponse.json({ success: false, error: 'Associated order not found.' }, { status: 404 })
      }
      if (user.role !== 'admin' && order.userId !== user.id) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }
      resolvedUserId = order.userId
      resolvedOrderId = order.id
      orderNumber = order.orderNumber
    } else if (user.role === 'admin' && targetUserId) {
      resolvedUserId = targetUserId
    }

    const file = await createProjectFile({
      orderId: resolvedOrderId,
      orderNumber,
      userId: resolvedUserId,
      uploaderId: user.id,
      uploaderName: user.fullName,
      uploaderRole: user.role === 'admin' ? 'admin' : 'client',
      fileName: String(fileName).trim(),
      fileType: String(fileType || 'application/octet-stream'),
      fileSize: Number(fileSize) || 0,
      category: user.role === 'admin' || category === 'deliverable' ? 'deliverable' : 'client_asset',
      contentBase64: dataUrl,
    })

    if (user.role !== 'admin') {
      await notifyOwners({
        type: 'file_uploaded',
        subject: `Client File Uploaded: ${file.fileName} (${orderNumber})`,
        clientName: user.fullName,
        clientEmail: user.email,
        priority: 'normal',
        details: {
          'File Name': file.fileName,
          Category: file.category.toUpperCase(),
          Order: orderNumber,
          'Uploaded By': `${user.fullName} (${user.email})`,
          Notes: notes || 'None',
        },
        actionLink: `/admin?tab=files`,
        actionLabel: 'Open Project File Center →',
      })
    } else if (orderId) {
      const order = await getOrderById(orderId)
      if (order?.clientEmail) {
        await sendClientEmail(
          order.clientEmail,
          `New Deliverable Uploaded for ${order.orderNumber}: ${file.fileName}`,
          `<h2>New Project File Available</h2><p>Hello ${order.clientName || 'Client'},</p><p>The TSTACK engineering team uploaded a new deliverable file (<strong>${file.fileName}</strong>) to your project workspace for order <strong>${order.orderNumber}</strong>.</p><p>Log in to your Client Portal to download it: https://tstack-ten.vercel.app/portal</p>`
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'File uploaded securely to the Project File Center.',
      file: {
        ...file,
        uploadedByRole: file.uploaderRole === 'admin' ? 'owner' : 'client',
        uploadedByName: file.uploaderName,
        dataUrl: file.contentBase64,
      },
    })
  } catch (err: any) {
    console.error('[Files POST API] Error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to upload file.' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'File ID required.' }, { status: 400 })
    }

    const file = await getProjectFileById(id)
    if (!file) {
      return NextResponse.json({ success: false, error: 'File not found.' }, { status: 404 })
    }

    if (user.role !== 'admin' && file.userId !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    await deleteProjectFile(id)
    return NextResponse.json({ success: true, message: 'File deleted.' })
  } catch (err: any) {
    console.error('[Files DELETE API] Error:', err)
    return NextResponse.json({ success: false, error: 'Failed to delete file.' }, { status: 500 })
  }
}
