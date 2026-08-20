import { requireCapability } from '@/lib/runtime/env';

export interface SignedUploadRequest {
  bucket: string;
  ownerId: string;
  path: string;
  contentType: string;
}

export async function createSignedUpload(request: SignedUploadRequest) {
  requireCapability('storage');
  const endpoint = process.env.STORAGE_SIGNER_URL;
  if (!endpoint) throw new Error('Storage signer is not configured.');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-internal-secret': process.env.STORAGE_SIGNER_SECRET ?? '' },
    body: JSON.stringify(request),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Storage signer failed with ${response.status}`);
  const body = (await response.json()) as { uploadUrl?: string; publicUrl?: string; objectPath?: string };
  if (!body.uploadUrl || !body.objectPath) throw new Error('Storage signer returned incomplete upload data');
  return body;
}
