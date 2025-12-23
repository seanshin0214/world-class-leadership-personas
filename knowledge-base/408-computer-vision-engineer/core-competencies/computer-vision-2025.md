# Computer Vision Engineering 2025: From CNNs to Vision Transformers

**Updated**: 2025-11-23 | **Stack**: PyTorch, YOLO, SAM, Stable Diffusion

---

## The CV Revolution is Here

```
2018: ResNet-50, manual annotation, weeks to train
2025: Vision Transformers, synthetic data, hours to train

KEY SHIFTS:
- CNNs → Vision Transformers (ViT)
- Supervised → Self-supervised learning
- Task-specific → Foundation models (SAM, CLIP)
- Expensive GPUs → Cloud + edge deployment
- Manual labels → Synthetic data + weak supervision
```

**Foundation Models**:
- **SAM (Segment Anything)**: Zero-shot segmentation
- **CLIP**: Zero-shot classification
- **DINO**: Self-supervised features
- **Stable Diffusion**: Image generation + editing

---

## Object Detection (YOLO family)

### YOLOv8 (2025 Standard)

```python
from ultralytics import YOLO
import cv2

# 1. Load model
model = YOLO('yolov8n.pt')  # n=nano, s=small, m=medium, l=large, x=extra-large

# Benchmark (COCO dataset):
# YOLOv8n: 37.3 mAP, 80 FPS on RTX 3090
# YOLOv8x: 53.9 mAP, 25 FPS

# 2. Inference on image
results = model('path/to/image.jpg')

# 3. Parse results
for result in results:
    boxes = result.boxes  # Bounding boxes
    
    for box in boxes:
        # Class
        cls = int(box.cls[0])
        class_name = model.names[cls]
        
        # Confidence
        conf = float(box.conf[0])
        
        # Bounding box coordinates
        x1, y1, x2, y2 = box.xyxy[0].tolist()
        
        if conf > 0.5:  # Confidence threshold
            print(f"{class_name}: {conf:.2f} at ({x1:.0f}, {y1:.0f}, {x2:.0f}, {y2:.0f})")

# 4. Visualize
annotated = results[0].plot()
cv2.imshow('Detection', annotated)
cv2.waitKey(0)
```

### Custom Object Detection

```python
# 1. Prepare dataset (YOLO format)
"""
dataset/
├── images/
│   ├── train/
│   └── val/
└── labels/
    ├── train/
    └── val/

Label format (one .txt per image):
<class_id> <x_center> <y_center> <width> <height>

Example (normalized 0-1):
0 0.5 0.5 0.3 0.4  # Class 0, center (0.5, 0.5), size (0.3, 0.4)
"""

# 2. Create data.yaml
"""
path: /path/to/dataset
train: images/train
val: images/val

nc: 3  # Number of classes
names: ['person', 'car', 'dog']
"""

# 3. Train
model = YOLO('yolov8n.pt')  # Start from pretrained

results = model.train(
    data='data.yaml',
    epochs=100,
    imgsz=640,
    batch=16,
    device=0,  # GPU 0
    workers=8,
    patience=20,  # Early stopping
    save_period=10,  # Save checkpoint every 10 epochs
    
    # Augmentation
    hsv_h=0.015,  # Hue augmentation
    hsv_s=0.7,    # Saturation
    hsv_v=0.4,    # Value
    degrees=10,   # Rotation
    translate=0.1,# Translation
    scale=0.5,    # Scaling
    fliplr=0.5,   # Horizontal flip
    mosaic=1.0,   # Mosaic augmentation
)

# 4. Validate
metrics = model.val()
print(f"mAP50: {metrics.box.map50:.3f}")
print(f"mAP50-95: {metrics.box.map:.3f}")

# 5. Export for deployment
model.export(format='onnx')  # or 'torchscript', 'coreml', 'tflite'
```

### Real-time Video Detection

```python
import cv2
from collections import deque

# Initialize model
model = YOLO('yolov8n.pt')

# Open video
cap = cv2.VideoCapture(0)  # Webcam (or video file path)

# FPS tracking
fps_queue = deque(maxlen=30)

while True:
    start_time = cv2.getTickCount()
    
    ret, frame = cap.read()
    if not ret:
        break
    
    # Inference
    results = model(frame, conf=0.5, iou=0.45)
    
    # Draw results
    annotated = results[0].plot()
    
    # Calculate FPS
    fps = cv2.getTickFrequency() / (cv2.getTickCount() - start_time)
    fps_queue.append(fps)
    avg_fps = sum(fps_queue) / len(fps_queue)
    
    # Display FPS
    cv2.putText(annotated, f'FPS: {avg_fps:.1f}', (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    
    cv2.imshow('Detection', annotated)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()

# Optimization tips for real-time:
# 1. Use YOLOv8n (nano) for speed
# 2. Reduce input size (imgsz=320 instead of 640)
# 3. Use TensorRT for 2-3x speedup on NVIDIA GPUs
# 4. Use INT8 quantization for edge devices
```

---

## Segmentation

### SAM (Segment Anything Model)

```python
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor
import cv2
import numpy as np

# 1. Load model
sam = sam_model_registry["vit_h"](checkpoint="sam_vit_h.pth")
sam.to(device="cuda")

# 2. Automatic mask generation
mask_generator = SamAutomaticMaskGenerator(
    model=sam,
    points_per_side=32,
    pred_iou_thresh=0.86,
    stability_score_thresh=0.92,
    crop_n_layers=1,
    crop_n_points_downscale_factor=2,
)

image = cv2.imread('image.jpg')
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

masks = mask_generator.generate(image_rgb)

# 3. Visualize masks
def show_masks(anns):
    if len(anns) == 0:
        return
    
    sorted_anns = sorted(anns, key=lambda x: x['area'], reverse=True)
    
    img = np.zeros((sorted_anns[0]['segmentation'].shape[0],
                    sorted_anns[0]['segmentation'].shape[1], 4))
    img[:,:,3] = 0
    
    for ann in sorted_anns:
        m = ann['segmentation']
        color_mask = np.concatenate([np.random.random(3), [0.35]])
        img[m] = color_mask
    
    return img

# 4. Prompt-based segmentation (with points/boxes)
predictor = SamPredictor(sam)
predictor.set_image(image_rgb)

# Positive point prompt
input_point = np.array([[500, 375]])  # x, y
input_label = np.array([1])  # 1=foreground, 0=background

masks, scores, logits = predictor.predict(
    point_coords=input_point,
    point_labels=input_label,
    multimask_output=True,
)

# Choose best mask
best_mask = masks[scores.argmax()]

# 5. Box prompt
input_box = np.array([100, 100, 500, 500])  # x1, y1, x2, y2

masks, _, _ = predictor.predict(
    point_coords=None,
    point_labels=None,
    box=input_box[None, :],
    multimask_output=False,
)
```

### Custom Segmentation with DeepLabV3+

```python
import torch
import torchvision
from torchvision.models.segmentation import deeplabv3_resnet50

# 1. Load pretrained model
model = deeplabv3_resnet50(pretrained=True, progress=True)
model.eval()

# 2. Inference
image = Image.open('street.jpg')
preprocess = torchvision.transforms.Compose([
    torchvision.transforms.ToTensor(),
    torchvision.transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])

input_tensor = preprocess(image).unsqueeze(0)

with torch.no_grad():
    output = model(input_tensor)['out'][0]

output_predictions = output.argmax(0).byte().cpu().numpy()

# 3. Visualize (color map for classes)
from torchvision import transforms
import matplotlib.pyplot as plt

# Create color palette
palette = torch.tensor([2 ** 25 - 1, 2 ** 15 - 1, 2 ** 21 - 1])
colors = torch.as_tensor([i for i in range(21)])[:, None] * palette
colors = (colors % 255).numpy().astype("uint8")

# Apply colors
colored_mask = Image.fromarray(output_predictions).convert("P")
colored_mask.putpalette(colors)

plt.imshow(colored_mask)
plt.show()
```

---

## Image Classification

### Vision Transformer (ViT)

```python
from transformers import ViTImageProcessor, ViTForImageClassification
from PIL import Image
import torch

# 1. Load model
processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')
model = ViTForImageClassification.from_pretrained('google/vit-base-patch16-224')

# 2. Preprocess image
image = Image.open('cat.jpg')
inputs = processor(images=image, return_tensors="pt")

# 3. Inference
with torch.no_grad():
    outputs = model(**inputs)
    logits = outputs.logits

# 4. Get prediction
predicted_class_idx = logits.argmax(-1).item()
predicted_label = model.config.id2label[predicted_class_idx]
confidence = torch.nn.functional.softmax(logits, dim=1)[0][predicted_class_idx].item()

print(f"Predicted: {predicted_label} ({confidence:.2%})")

# Top-5 predictions
probs = torch.nn.functional.softmax(logits, dim=1)[0]
top5_prob, top5_idx = torch.topk(probs, 5)

for prob, idx in zip(top5_prob, top5_idx):
    print(f"{model.config.id2label[idx.item()]}: {prob.item():.2%}")
```

### Fine-tuning for Custom Classes

```python
from transformers import ViTForImageClassification, ViTImageProcessor
from transformers import Trainer, TrainingArguments
from datasets import load_dataset

# 1. Load dataset (assuming Hugging Face format)
dataset = load_dataset("imagefolder", data_dir="./my_dataset")

# 2. Preprocess
processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')

def transform(example_batch):
    inputs = processor([x for x in example_batch['image']], return_tensors='pt')
    inputs['labels'] = example_batch['label']
    return inputs

prepared_dataset = dataset.with_transform(transform)

# 3. Load model (customize output layer)
model = ViTForImageClassification.from_pretrained(
    'google/vit-base-patch16-224',
    num_labels=len(dataset['train'].features['label'].names),
    id2label={str(i): label for i, label in enumerate(dataset['train'].features['label'].names)},
    label2id={label: str(i) for i, label in enumerate(dataset['train'].features['label'].names)}
)

# 4. Training arguments
training_args = TrainingArguments(
    output_dir='./results',
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    num_train_epochs=10,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    load_best_model_at_end=True,
    metric_for_best_model="accuracy",
    fp16=True,  # Mixed precision
)

# 5. Define metrics
from sklearn.metrics import accuracy_score
import numpy as np

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    return {"accuracy": accuracy_score(labels, predictions)}

# 6. Train
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=prepared_dataset['train'],
    eval_dataset=prepared_dataset['validation'],
    compute_metrics=compute_metrics,
)

trainer.train()

# 7. Evaluate
metrics = trainer.evaluate()
print(f"Accuracy: {metrics['eval_accuracy']:.2%}")
```

---

## Image Generation (Stable Diffusion)

### Text-to-Image

```python
from diffusers import StableDiffusionPipeline
import torch

# 1. Load model
model_id = "stabilityai/stable-diffusion-2-1"
pipe = StableDiffusionPipeline.from_pretrained(
    model_id,
    torch_dtype=torch.float16
)
pipe = pipe.to("cuda")

# 2. Generate image
prompt = "a beautiful sunset over the ocean, highly detailed, 8k, photorealistic"
negative_prompt = "ugly, blurry, low quality, distorted"

image = pipe(
    prompt=prompt,
    negative_prompt=negative_prompt,
    num_inference_steps=50,  # More steps = better quality
    guidance_scale=7.5,  # How closely to follow prompt
    height=512,
    width=512,
).images[0]

image.save("sunset.png")

# 3. Batch generation
prompts = [
    "a cat wearing sunglasses",
    "a dog in space",
    "a robot reading a book"
]

images = pipe(
    prompt=prompts,
    num_inference_steps=30,
).images

for i, img in enumerate(images):
    img.save(f"image_{i}.png")
```

### Image-to-Image (Style Transfer)

```python
from diffusers import StableDiffusionImg2ImgPipeline
from PIL import Image

# 1. Load model
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(
    "stabilityai/stable-diffusion-2-1",
    torch_dtype=torch.float16
).to("cuda")

# 2. Load input image
init_image = Image.open("photo.jpg").convert("RGB")
init_image = init_image.resize((512, 512))

# 3. Generate variations
prompt = "a watercolor painting of the same scene"

images = pipe(
    prompt=prompt,
    image=init_image,
    strength=0.75,  # How much to change (0=no change, 1=completely new)
    guidance_scale=7.5,
    num_inference_steps=50,
).images[0]

images.save("watercolor.png")
```

### ControlNet (Precise Control)

```python
from diffusers import StableDiffusionControlNetPipeline, ControlNetModel
import cv2

# 1. Load ControlNet (Canny edge detection)
controlnet = ControlNetModel.from_pretrained(
    "lllyasviel/sd-controlnet-canny",
    torch_dtype=torch.float16
)

pipe = StableDiffusionControlNetPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    controlnet=controlnet,
    torch_dtype=torch.float16
).to("cuda")

# 2. Create control image (edge map)
image = cv2.imread('input.jpg')
edges = cv2.Canny(image, 100, 200)
edges = Image.fromarray(edges)

# 3. Generate with precise structure
prompt = "a futuristic cityscape, cyberpunk style, neon lights"

output = pipe(
    prompt=prompt,
    image=edges,
    num_inference_steps=20,
).images[0]

output.save("controlled_generation.png")
```

---

## Model Optimization

### Quantization

```python
import torch
from torch.quantization import quantize_dynamic

# 1. Load model
model = torchvision.models.resnet50(pretrained=True)
model.eval()

# 2. Dynamic quantization (easiest)
quantized_model = quantize_dynamic(
    model,
    {torch.nn.Linear, torch.nn.Conv2d},  # Which layers to quantize
    dtype=torch.qint8  # 8-bit integers
)

# 3. Compare sizes
def print_size_of_model(model):
    torch.save(model.state_dict(), "temp.p")
    print('Size (MB):', os.path.getsize("temp.p")/1e6)
    os.remove('temp.p')

print("Original model:")
print_size_of_model(model)  # ~98 MB

print("\nQuantized model:")
print_size_of_model(quantized_model)  # ~25 MB (4x smaller!)

# 4. Benchmark inference speed
import time

def benchmark(model, input_tensor, num_runs=100):
    start = time.time()
    for _ in range(num_runs):
        _ = model(input_tensor)
    end = time.time()
    return (end - start) / num_runs

input_tensor = torch.randn(1, 3, 224, 224)

print(f"Original: {benchmark(model, input_tensor)*1000:.2f} ms")
print(f"Quantized: {benchmark(quantized_model, input_tensor)*1000:.2f} ms")

# Typical results:
# Size: 4x smaller
# Speed: 2-3x faster on CPU
# Accuracy: 1-2% drop
```

### ONNX Export (Cross-platform)

```python
import torch.onnx

# 1. Export to ONNX
model = torchvision.models.resnet50(pretrained=True)
model.eval()

dummy_input = torch.randn(1, 3, 224, 224)

torch.onnx.export(
    model,
    dummy_input,
    "resnet50.onnx",
    export_params=True,
    opset_version=14,
    do_constant_folding=True,
    input_names=['input'],
    output_names=['output'],
    dynamic_axes={'input': {0: 'batch_size'}, 'output': {0: 'batch_size'}}
)

# 2. Run with ONNX Runtime (faster inference)
import onnxruntime as ort
import numpy as np

ort_session = ort.InferenceSession("resnet50.onnx")

def to_numpy(tensor):
    return tensor.detach().cpu().numpy()

# Inference
ort_inputs = {ort_session.get_inputs()[0].name: to_numpy(dummy_input)}
ort_outs = ort_session.run(None, ort_inputs)

# Speed comparison:
# PyTorch: 12ms
# ONNX Runtime: 6ms (2x faster!)
```

---

## Edge Deployment

### TensorFlow Lite Conversion

```python
import tensorflow as tf

# 1. Convert PyTorch → ONNX → TensorFlow → TFLite
# (Multi-step process, use ai_edge_torch library)

from ai_edge_torch import convert

# Load PyTorch model
pytorch_model = torch.load('model.pth')

# Convert to TFLite
edge_model = convert(
    pytorch_model,
    sample_args=(torch.randn(1, 3, 224, 224),)
)

# Save
edge_model.export('model.tflite')

# 2. Quantize for mobile
converter = tf.lite.TFLiteConverter.from_saved_model('saved_model_dir')
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.target_spec.supported_types = [tf.float16]  # 16-bit float

tflite_model = converter.convert()

with open('model_quantized.tflite', 'wb') as f:
    f.write(tflite_model)

# Results:
# Size: 100MB → 25MB (4x reduction)
# Inference: 80ms → 25ms on mobile (3x faster)
# Accuracy drop: ~1%
```

---

## Production Best Practices

### Model Versioning & A/B Testing

```python
class ModelRegistry:
    def __init__(self):
        self.models = {}
        self.traffic_split = {}
    
    def register(self, name, version, model_path, traffic_percent=0):
        """
        Register a new model version
        """
        model_id = f"{name}_v{version}"
        self.models[model_id] = {
            'path': model_path,
            'model': None,  # Lazy load
            'metrics': {},
        }
        self.traffic_split[model_id] = traffic_percent
    
    def get_model(self, name, user_id=None):
        """
        Get model based on A/B test traffic split
        """
        # Determine which version for this user
        import random
        rand = random.random() if user_id is None else hash(user_id) % 100 / 100
        
        cumulative = 0
        for model_id, traffic in self.traffic_split.items():
            if name in model_id:
                cumulative += traffic / 100
                if rand < cumulative:
                    # Lazy load model
                    if self.models[model_id]['model'] is None:
                        self.models[model_id]['model'] = self._load_model(
                            self.models[model_id]['path']
                        )
                    return model_id, self.models[model_id]['model']
        
        # Default to latest
        latest = max([m for m in self.models.keys() if name in m])
        return latest, self.models[latest]['model']
    
    def _load_model(self, path):
        # Load model from path
        return YOLO(path)

# Usage
registry = ModelRegistry()

# Register models
registry.register('detector', version=1, model_path='yolov8_v1.pt', traffic_percent=80)
registry.register('detector', version=2, model_path='yolov8_v2.pt', traffic_percent=20)

# Get model for user
user_id = "user_12345"
model_version, model = registry.get_model('detector', user_id)

# Track metrics per version
results = model.predict('image.jpg')
registry.models[model_version]['metrics']['requests'] += 1
```

---

## Key Takeaways

1. **Foundation models first** - SAM, CLIP before training custom
2. **YOLOv8 for detection** - State-of-art speed/accuracy
3. **ViT for classification** - Transformers > CNNs
4. **Quantization for deployment** - 4x smaller, 2-3x faster
5. **A/B test model versions** - Gradual rollout, not big bang
6. **Monitor everything** - Latency, accuracy, cost

---

## References

- "Deep Learning for Computer Vision" - Rajalingappaa Shanmugamani
- YOLOv8 Documentation (Ultralytics)
- Hugging Face Transformers
- Stable Diffusion Guide
- PyTorch Documentation

**Related**: `deep-learning.md`, `model-optimization.md`, `mlops.md`
