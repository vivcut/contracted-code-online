export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string; // Markdown content
  tags: string[];
  date: string;
  author: string;
  imageUrl?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "ultimate-skincare-guide",
    title: "The Ultimate Skincare Guide: From Acne to Glass Skin",
    slug: "ultimate-skincare-guide",
    description: "Comprehensive skincare guide covering all skin types, acne treatment, and achieving the coveted 'glass skin' look",
    content: `# The Ultimate Skincare Guide

## Introduction
Taking care of your skin is more important now than ever before. In today's image-focused world, having clear, glowing skin can make a huge difference in how you look and feel. This skin care guide will provide you with the knowledge and tools to care for your unique skin type.

# hey

## Lifestyle Factors for Healthy Skin
Your lifestyle choices play a big role in skin health:
- **Diet**: Eat vegetables, fruits, healthy fats and protein
- **Sleep**: Aim for 7-9 hours per night
- **Stress management**: Chronic stress takes a toll on your skin
- **Smoking**: Accelerates aging of the skin
- **Sun protection**: Wear sunscreen daily

## Skin Types
There are five main skin types:
1. Normal - Balanced and clear
2. Combination - Oily in T-zone, dry elsewhere
3. Dry - Needs consistent hydration
4. Oily - Requires oil control
5. Sensitive - Needs gentle products

## Treating Acne
Acne types:
- Whiteheads
- Blackheads
- Papules
- Pustules
- Nodules
- Cystic acne

### Recommended Treatment Cycle:
- Weeks 1-4: Gradual introduction of benzoyl peroxide and tretinoin
- Weeks 5-12: Increased tretinoin strength

## Achieving Glass Skin (Korean Beauty Routine)
1. Double Cleansing
2. Toner
3. Essences
4. Serums
5. Sheet Masks
6. Moisturizer & Eye Cream
7. SPF/Sunscreen
8. Exfoliation (2x/week)

## Product Recommendations:
- Cleansers: Sulwhasoo Gentle Cleansing Foam, Krave Beauty Matcha Hemp
- Toners: Klairs Supple Preparation, Isntree Hyaluronic Acid
- Serums: COSRX Snail Mucin, Sulwhasoo First Care Activating Serum (GOAT)
- Sunscreens: PURITO Centella SPF50+, COSRX Aloe Sun Cream`,
    tags: ["skincare", "acne-treatment", "glass-skin", "korean-beauty"],
    date: "2023-12-01",
    author: "SkinCareMaxxer",
    imageUrl: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1000w,f_avif,q_auto:eco,dpr_2/rockcms/2024-01/240117-staff-skin-care-routines-social-2c85d8.jpg"
  },
  {
    id: "mewing-guide",
    title: "The Complete Mewing Guide: Reshape Your Jawline Naturally",
    slug: "complete-mewing-guide",
    description: "Step-by-step guide to proper tongue posture for facial remodeling and jawline enhancement",
    content: `# The Complete Mewing Guide

## What is Mewing?
Mewing is the practice of maintaining proper tongue posture against the roof of the mouth to encourage...

## Science Behind Mewing
- **Bone Remodeling**: Pressure stimulates osteoblasts...
- **Palatal Expansion**: Studies show up to 3mm expansion in adults...
- **Facial Angles**: Improves gonial angle by...

## Proper Technique
1. **Tongue Placement**:
   - Entire tongue on palate
   - Posterior third elevated
2. **Lip Seal**: Maintain light contact
3. **Breathing**: Exclusive nasal breathing

## Advanced Methods
- Hard mewing protocols
- Chin tuck variations
- Chewing gum supplementation

## Expected Results Timeline
| Month | Changes |
|-------|---------|
| 1-3   | Postural adaptation |
| 6-12  | Visible jawline changes |`,
    tags: ["mewing", "jawline", "facial-growth"],
    date: "2023-10-20",
    author: "Dr. JawMax",
    imageUrl: "/images/mewing-technique.jpg"
  },
  {
    id: "holistic-maxxing",
    title: "Holistic Looksmaxxing: Beyond Just Face and Skin",
    slug: "holistic-looksmaxxing",
    description: "Complete guide to full-body aesthetic optimization including hair, physique and style",
    content: `# Complete Looksmaxxing Framework

## Hair Maximization
- Minoxidil protocols
- Dermarolling techniques
- Transplant options

## Body Aesthetics
- Neck training exercises
- Forearm development
- Posture correction

## Style Optimization
- Color analysis
- Fit rules
- Optical illusions

## Psychological Components
- Confidence building
- Social skills
- Outcome independence`,
    tags: ["looksmaxxing", "aesthetics", "self-improvement"],
    date: "2023-11-15",
    author: "Aesthetic Coach",
    imageUrl: "/images/holistic-aesthetics.jpg"
  }
];