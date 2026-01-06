/**
 * Centralized Z-Index Management System
 * 
 * This file defines all z-index values used throughout the application
 * to prevent z-index conflicts and maintain proper stacking order.
 * 
 * Usage:
 * import { Z_INDEX } from '@/constants/zIndex';
 * <div className="..." style={{ zIndex: Z_INDEX.modal }}>
 */

export const Z_INDEX = {
  // Base layer (default document flow)
  base: 0,
  
  // Background elements
  backgroundPattern: -1,
  
  // Content layers
  content: 1,
  dropdown: 10,
  
  // Sticky elements
  stickyHeader: 40,
  
  // Overlays and modals
  overlay: 40,
  sidebar: 50,
  modal: 60,
  
  // Tooltips and popovers
  tooltip: 70,
  popover: 70,
  
  // Notifications and alerts (highest priority)
  notification: 80,
  alert: 90,
  
  // Special cases
  themeSelector: 50, // Same as sidebar, needs to appear above dropdown
} as const;

export type ZIndexKey = keyof typeof Z_INDEX;

/**
 * Helper function to get z-index value
 * Provides type safety and autocomplete
 */
export const getZIndex = (key: ZIndexKey): number => Z_INDEX[key];
