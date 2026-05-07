# Editable Cart Feature - Ice Crumble POS

## Overview
The POS system now supports **editable cart items** to handle customer customization requests (e.g., "10 pesos only without toppings").

## New Features

### 1. **Edit Button on Each Cart Item**
- Every item in the cart now has an "Edit" button
- Click to toggle edit mode for that specific item

### 2. **Custom Price Adjustment**
- Modify the price per item to accommodate customer requests
- Original price is displayed with strikethrough when modified
- Easy "Reset to original price" option available

### 3. **Customization Notes**
- Add notes to track what was customized (e.g., "no toppings", "extra syrup", "less ice")
- Notes are saved with the sale and displayed in the item name in sales history
- Format: `Item Name (customization note)`

### 4. **Visual Indicators**
- 📝 Icon shows when a customization note is added
- Strikethrough text shows original price when modified
- Border highlights on hover for better UX

## How to Use

### For Regular Orders:
1. Click menu items to add to cart
2. Adjust quantity with +/- buttons
3. Confirm sale

### For Custom Orders:
1. Add item to cart
2. Click **"Edit"** button on the cart item
3. Enter custom price (e.g., 10 for ₱10)
4. Add customization note (e.g., "no toppings")
5. Click **"Done"** to close edit mode
6. Adjust quantity if needed
7. Confirm sale

## Technical Details

### Frontend Changes (`frontend/src/pages/POS.jsx`)
- Added `editingItemId` state to track which item is being edited
- Added `originalPrice` to cart items to preserve menu price
- Added `customNote` field for tracking customizations
- New functions:
  - `updatePrice()` - Modify item price
  - `updateCustomNote()` - Add/edit customization notes
  - `toggleEditMode()` - Show/hide edit panel
  - `resetToOriginalPrice()` - Restore original price and clear notes

### Data Flow
- Cart items store: `menuItemId`, `name`, `price`, `originalPrice`, `quantity`, `customNote`
- On sale confirmation, custom notes are appended to item name
- Backend receives: `menuItemId`, `name (with note)`, `price`, `quantity`

### Styling
- Uses locked color palette (Warm Coral, Golden Amber, Soft Terracotta, Creamy Ivory)
- Verdana font throughout
- Mobile-first responsive design
- Smooth transitions and hover effects

## Benefits

✅ **Flexibility**: Handle any customer customization request
✅ **Tracking**: Notes preserved in sales history for reference
✅ **Accuracy**: Custom prices ensure correct revenue tracking
✅ **User-Friendly**: Simple edit interface, no complex forms
✅ **Mobile-Optimized**: Works perfectly on phone and tablet browsers

## Example Use Cases

1. **Customer wants item without toppings**
   - Edit item → Set price to ₱10 → Note: "no toppings"

2. **Customer wants extra toppings**
   - Edit item → Set price to ₱25 → Note: "extra toppings"

3. **Special discount**
   - Edit item → Set price to ₱15 → Note: "senior discount"

4. **Custom combination**
   - Edit item → Set price to ₱20 → Note: "half toppings, extra syrup"

## Notes
- Original menu prices remain unchanged
- Each cart item can have different custom pricing
- Customization notes appear in sales history for tracking
- All changes are per-transaction only (menu items not affected)