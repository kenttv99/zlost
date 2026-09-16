import os
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
from scipy.ndimage import gaussian_filter

def main():
    os.environ["U2NET_HOME"] = os.path.abspath(r".venv\rembg_cache")
    import rembg

    input_path = os.path.abspath(r"media\1-ref.jpg")
    bg_path = os.path.abspath(r"C:\Users\KATANA\.gemini\antigravity-ide\brain\eee87493-89d6-460c-a387-4fd09dbec6cc\studio_backdrop_1789500942214.jpg")
    output_path = os.path.abspath(r"public\assets\hero_portrait.jpg")

    print(f"Loading subject: {input_path}")
    orig_img = Image.open(input_path).convert("RGB")
    width, height = orig_img.size

    print(f"Loading backdrop: {bg_path}")
    bg_img = Image.open(bg_path).convert("RGB")
    bg_img = bg_img.resize((width, height), Image.Resampling.LANCZOS)

    print("Extracting subject with rembg...")
    rgba_subject = rembg.remove(orig_img)
    subject_rgb = np.array(rgba_subject.convert("RGB"), dtype=np.float32)
    alpha = np.array(rgba_subject.split()[-1], dtype=np.float32) / 255.0

    # 1. Subtle warm color balance to harmonize overcast daylight with studio warm light
    # Slightly enhance warmth in midtones (R: +4%, G: +1%, B: -3%)
    warm_subject = subject_rgb.copy()
    warm_subject[:, :, 0] = np.clip(warm_subject[:, :, 0] * 1.04, 0, 255)
    warm_subject[:, :, 1] = np.clip(warm_subject[:, :, 1] * 1.01, 0, 255)
    warm_subject[:, :, 2] = np.clip(warm_subject[:, :, 2] * 0.96, 0, 255)

    # 2. Defringe edge pixels: on hair edges, sea foam tint can create a grey halo.
    # Replace background color bleed in semi-transparent edges with hair tone
    edge_mask = (alpha > 0.05) & (alpha < 0.92)
    # Warm tone tint for fringe
    hair_tint = np.array([165, 140, 110], dtype=np.float32)
    warm_subject[edge_mask] = warm_subject[edge_mask] * 0.6 + hair_tint * 0.4

    # 3. Ambient wrap lighting: subtle warm rim light on hair/shoulder contours
    # Find boundary region of the subject
    dilated_alpha = gaussian_filter(alpha, sigma=6)
    rim_mask = np.clip(dilated_alpha - alpha, 0, 1)
    # Filter rim mask to focus near upper body/hair
    y_coords = np.linspace(1.0, 0.2, height)[:, None]
    rim_mask = rim_mask * y_coords

    # Studio ambient rim color (amber/bronze glow)
    rim_color = np.array([210, 145, 80], dtype=np.float32)

    # 4. Soft background contact shadow for 3D depth behind her
    shadow_mask = gaussian_filter(alpha, sigma=25) * 0.45
    bg_np = np.array(bg_img, dtype=np.float32)
    # Apply shadow to background
    for c in range(3):
        bg_np[:, :, c] = bg_np[:, :, c] * (1.0 - shadow_mask)

    # 5. Composite: Background + Shadow + Rim Light + Subject
    alpha_3d = alpha[:, :, None]
    final_np = bg_np * (1.0 - alpha_3d) + warm_subject * alpha_3d

    # Add subtle rim light wrap onto edges
    rim_3d = (rim_mask[:, :, None] * 0.35) * (1.0 - alpha_3d * 0.5)
    final_np = np.clip(final_np + rim_color * rim_3d, 0, 255).astype(np.uint8)

    final_img = Image.fromarray(final_np)

    # Slight editorial contrast boost
    enhancer = ImageEnhance.Contrast(final_img)
    final_img = enhancer.enhance(1.05)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    final_img.save(output_path, "JPEG", quality=96)
    print(f"Composited portrait saved to {output_path}")

if __name__ == '__main__':
    main()
