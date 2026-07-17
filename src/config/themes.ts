export interface DesignTokens {
  '--color-background': string;
  '--color-foreground': string;
  '--color-surface': string;
  '--color-surface-hover': string;
  '--color-primary': string;
  '--color-primary-hover': string;
  '--color-border': string;
  '--color-border-strong': string;
  
  // Specific thematic colors
  '--color-accent-1': string;
  '--color-accent-2': string;
  '--color-accent-3': string;

  // Glassmorphism
  '--glass-opacity': string;
  '--glass-blur': string;
  '--glass-shadow': string;

  // Glow
  '--glow-color': string;

  // Gradients
  '--gradient-hero': string;
  '--gradient-card': string;
}

export interface AmbientConfig {
  type: 'petals' | 'bubbles' | 'gold-dust' | 'leaves' | 'stars';
  density: 'low' | 'medium' | 'high';
  speed: 'slow' | 'normal' | 'fast';
  direction: 'up' | 'down' | 'drift';
}

export interface MotionProfile {
  easing: string;
  durationFast: string;
  durationNormal: string;
  durationSlow: string;
  buttonBounce: boolean;
  cardTilt: boolean;
}

export interface ThemeConfig {
  id: string;
  name: string;
  mood: string[];
  tokens: DesignTokens;
  ambient: AmbientConfig;
  motion: MotionProfile;
}

export const themes: Record<string, ThemeConfig> = {
  'soft-sakura': {
    id: 'soft-sakura',
    name: 'Soft Sakura',
    mood: ['Elegant', 'Relaxing', 'Calm', 'Comfortable', 'Minimal'],
    tokens: {
      '--color-background': '#FFF5FA',
      '--color-foreground': '#241522',
      '--color-surface': 'rgba(255, 255, 255, 0.7)',
      '--color-surface-hover': 'rgba(255, 255, 255, 0.9)',
      '--color-primary': '#FF8DC4',
      '--color-primary-hover': '#F05AA5',
      '--color-border': 'rgba(255, 183, 217, 0.3)',
      '--color-border-strong': 'rgba(255, 143, 196, 0.4)',
      
      '--color-accent-1': '#FFCCE5',
      '--color-accent-2': '#FFE4F1',
      '--color-accent-3': '#FFB3D9',

      '--glass-opacity': '0.7',
      '--glass-blur': '12px',
      '--glass-shadow': '0 8px 32px rgba(136, 60, 93, 0.05)',

      '--glow-color': 'rgba(255, 141, 196, 0.3)',

      '--gradient-hero': 'linear-gradient(135deg, #FF8DC4, #F05AA5)',
      '--gradient-card': 'linear-gradient(135deg, #FFB3D9, #FFE4F1, #FFB3D9)',
    },
    ambient: {
      type: 'petals',
      density: 'low',
      speed: 'slow',
      direction: 'drift'
    },
    motion: {
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      durationFast: '200ms',
      durationNormal: '400ms',
      durationSlow: '600ms',
      buttonBounce: false,
      cardTilt: false
    }
  },
  'cotton-candy': {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    mood: ['Cute', 'Playful', 'Sweet', 'Happy'],
    tokens: {
      '--color-background': '#F8F4FF',
      '--color-foreground': '#2D1B30',
      '--color-surface': 'rgba(255, 255, 255, 0.85)',
      '--color-surface-hover': 'rgba(255, 255, 255, 1)',
      '--color-primary': '#E879F9',
      '--color-primary-hover': '#D946EF',
      '--color-border': 'rgba(232, 121, 249, 0.2)',
      '--color-border-strong': 'rgba(232, 121, 249, 0.4)',
      
      '--color-accent-1': '#F5D0FE',
      '--color-accent-2': '#FAE8FF',
      '--color-accent-3': '#F0ABFC',

      '--glass-opacity': '0.85',
      '--glass-blur': '16px',
      '--glass-shadow': '0 10px 40px rgba(217, 70, 239, 0.1)',

      '--glow-color': 'rgba(232, 121, 249, 0.4)',

      '--gradient-hero': 'linear-gradient(135deg, #E879F9, #FF8DC4)',
      '--gradient-card': 'linear-gradient(135deg, #F0ABFC, #FAE8FF, #F0ABFC)',
    },
    ambient: {
      type: 'bubbles',
      density: 'medium',
      speed: 'normal',
      direction: 'up'
    },
    motion: {
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy
      durationFast: '150ms',
      durationNormal: '300ms',
      durationSlow: '500ms',
      buttonBounce: true,
      cardTilt: false
    }
  },
  'rose-gold': {
    id: 'rose-gold',
    name: 'Rose Gold',
    mood: ['Luxury', 'Elegant', 'Premium'],
    tokens: {
      '--color-background': '#FCF9F9',
      '--color-foreground': '#3E2A35',
      '--color-surface': 'rgba(255, 255, 255, 0.6)',
      '--color-surface-hover': 'rgba(255, 255, 255, 0.9)',
      '--color-primary': '#D4AF37', // Gold
      '--color-primary-hover': '#B5952F',
      '--color-border': 'rgba(212, 175, 55, 0.25)',
      '--color-border-strong': 'rgba(212, 175, 55, 0.5)',
      
      '--color-accent-1': '#F6C6D8', // Blush pink
      '--color-accent-2': '#FDEBF3',
      '--color-accent-3': '#E2C2B3',

      '--glass-opacity': '0.6',
      '--glass-blur': '20px',
      '--glass-shadow': '0 12px 32px rgba(62, 42, 53, 0.12)',

      '--glow-color': 'rgba(212, 175, 55, 0.3)',

      '--gradient-hero': 'linear-gradient(135deg, #F6C6D8, #D4AF37)',
      '--gradient-card': 'linear-gradient(135deg, #E2C2B3, #FDEBF3, #E2C2B3)',
    },
    ambient: {
      type: 'gold-dust',
      density: 'medium',
      speed: 'slow',
      direction: 'drift'
    },
    motion: {
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      durationFast: '200ms',
      durationNormal: '400ms',
      durationSlow: '700ms',
      buttonBounce: false,
      cardTilt: true
    }
  },
  'cherry-blossom': {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    mood: ['Fresh', 'Natural', 'Soft', 'Bright'],
    tokens: {
      '--color-background': '#F0FDF4', // Minty fresh base
      '--color-foreground': '#164E63',
      '--color-surface': 'rgba(255, 255, 255, 0.75)',
      '--color-surface-hover': 'rgba(255, 255, 255, 0.95)',
      '--color-primary': '#FDA4AF', // Rose/Pink
      '--color-primary-hover': '#FB7185',
      '--color-border': 'rgba(253, 164, 175, 0.3)',
      '--color-border-strong': 'rgba(253, 164, 175, 0.5)',
      
      '--color-accent-1': '#FECDD3',
      '--color-accent-2': '#FFE4E6',
      '--color-accent-3': '#A7F3D0', // Green accent

      '--glass-opacity': '0.75',
      '--glass-blur': '10px',
      '--glass-shadow': '0 4px 20px rgba(22, 78, 99, 0.08)',

      '--glow-color': 'rgba(253, 164, 175, 0.35)',

      '--gradient-hero': 'linear-gradient(135deg, #FDA4AF, #34D399)',
      '--gradient-card': 'linear-gradient(135deg, #FECDD3, #FFF, #A7F3D0)',
    },
    ambient: {
      type: 'leaves',
      density: 'high',
      speed: 'fast',
      direction: 'down'
    },
    motion: {
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      durationFast: '150ms',
      durationNormal: '250ms',
      durationSlow: '400ms',
      buttonBounce: false,
      cardTilt: true
    }
  },
  'pink-galaxy': {
    id: 'pink-galaxy',
    name: 'Pink Galaxy',
    mood: ['Magic', 'Modern', 'Dreamy'],
    tokens: {
      '--color-background': '#1A1025', // Dark navy/purple base
      '--color-foreground': '#F3E8FF',
      '--color-surface': 'rgba(45, 27, 62, 0.5)',
      '--color-surface-hover': 'rgba(59, 35, 83, 0.7)',
      '--color-primary': '#D946EF', // Fuchsia
      '--color-primary-hover': '#E879F9',
      '--color-border': 'rgba(217, 70, 239, 0.2)',
      '--color-border-strong': 'rgba(217, 70, 239, 0.4)',
      
      '--color-accent-1': '#C084FC',
      '--color-accent-2': '#E9D5FF',
      '--color-accent-3': '#A855F7',

      '--glass-opacity': '0.5',
      '--glass-blur': '24px',
      '--glass-shadow': '0 8px 32px rgba(217, 70, 239, 0.15)',

      '--glow-color': 'rgba(217, 70, 239, 0.5)',

      '--gradient-hero': 'linear-gradient(135deg, #D946EF, #8B5CF6)',
      '--gradient-card': 'linear-gradient(135deg, rgba(217,70,239,0.2), rgba(139,92,246,0.1), rgba(217,70,239,0.2))',
    },
    ambient: {
      type: 'stars',
      density: 'high',
      speed: 'normal',
      direction: 'drift'
    },
    motion: {
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      durationFast: '200ms',
      durationNormal: '350ms',
      durationSlow: '550ms',
      buttonBounce: false,
      cardTilt: true
    }
  }
};
