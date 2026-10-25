import type { TNodeExecutor } from '../model/types';

const applyImageFilter = async (imageUrl: string, filter: string): Promise<string> => {
  if (imageUrl.startsWith('data:') && !imageUrl.startsWith('data:image/')) {
    throw new Error('The connected file is not an image.');
  }

  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Image request failed with ${response.status}.`);

  const bitmap = await createImageBitmap(await response.blob());
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not create an image processing canvas.');

  const filters: Record<string, string> = {
    blur: 'blur(4px)',
    grayscale: 'grayscale(1)',
    invert: 'invert(1)',
    sepia: 'sepia(1)',
  };
  context.filter = filters[filter] || 'none';
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  return canvas.toDataURL('image/png');
};

export const executeImageNode: TNodeExecutor = async (node, input) => {
  const data = node.data;
  const imageUrl = String(
    input.connectedImageUrl || data.imageUrl || data.url || input.imageUrl || input.value || '',
  );
  if (!imageUrl) throw new Error('Image URL or incoming image is required.');

  try {
    const processedImage = await applyImageFilter(imageUrl, String(data.filter || 'blur'));
    return {
      ...input,
      imageUrl: processedImage,
      processed: processedImage,
      value: processedImage,
    };
  } catch (error) {
    throw new Error(
      `Image processing failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
