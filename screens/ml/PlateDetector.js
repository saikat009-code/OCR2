import { TFLiteModel } from 'react-native-fast-tflite';

let model;
let isModelLoading = false;

export const loadPlateModel = async () => {
  if (!model && !isModelLoading) {
    try {
      isModelLoading = true;
      model = await TFLiteModel.load({
        modelPath: 'anpr2_yolov9_int8.tflite',
        threads: 2,
        useGpu: true, // iOS only
      });
      isModelLoading = false;
      return model;
    } catch (error) {
      isModelLoading = false;
      console.error('Failed to load model:', error);
      throw error;
    }
  }
  return model;
};

export const detectPlate = async (imagePath) => {
  try {
    const model = await loadPlateModel();
    if (!model) {
      throw new Error('Model not loaded');
    }

    const results = await model.runOnImage({
      path: imagePath,
      threshold: 0.4,
      numResults: 1,
    });

    return results?.[0] || null;
  } catch (error) {
    console.error('Detection error:', error);
    return null;
  }
};