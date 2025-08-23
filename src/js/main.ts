// Main TypeScript file for ePanda Shopping

// Product interface
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

// Shopping Cart class with persistence
class ShoppingCart {
  private items: Product[] = [];
  private storageKey = "epanda-cart";

  constructor() {
    this.loadFromStorage();
    this.updateCartUI();
  }

  private loadFromStorage(): void {
    const storedItems = localStorage.getItem(this.storageKey);
    if (storedItems) {
      this.items = JSON.parse(storedItems);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  addItem(product: Product): void {
    this.items.push(product);
    this.saveToStorage();
    this.updateCartUI();
    this.showNotification(`Added ${product.name} to cart!`);
  }

  removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.id !== productId);
    this.saveToStorage();
    this.updateCartUI();
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  getItemCount(): number {
    return this.items.length;
  }

  private updateCartUI(): void {
    const cartBadge = document.querySelector(".indicator-item");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    const countStr = this.getItemCount().toString();
    const totalStr = this.getTotal().toString();

    if (cartBadge) {
      cartBadge.textContent = countStr;
    }
    if (cartCount) {
      cartCount.textContent = countStr;
    }
    if (cartTotal) {
      cartTotal.textContent = totalStr;
    }
  }

  private showNotification(message: string): void {
    const toast = document.createElement("div");
    toast.className = "toast toast-top toast-end";
    toast.innerHTML = `
      <div class="alert alert-success">
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// Initialize cart
const cart = new ShoppingCart();

// Add event listeners after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  // Add to cart buttons
  const buyButtons = document.querySelectorAll(".btn-primary");
  buyButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const card = target.closest(".card");
      if (card) {
        const name =
          card.querySelector(".card-title")?.textContent || "Product";
        const priceText =
          card.querySelector(".text-pink-500")?.textContent || "$0";
        const price = parseFloat(priceText.replace("$", ""));
        const image = card.querySelector("img")?.src || "";
        const product: Product = {
          id: Date.now(),
          name,
          price,
          category: "General",
          image,
        };
        cart.addItem(product);
      }
    });
  });

  // Theme toggle button
  const themeToggle = document.createElement("div");
  themeToggle.className = "fixed bottom-4 right-4 z-50";
  themeToggle.innerHTML = `
    <label class="swap swap-rotate btn btn-circle">
      <input type="checkbox" id="theme-toggle" />
      <svg class="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
      </svg>
      <svg class="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
      </svg>
    </label>
  `;
  document.body.appendChild(themeToggle);

  const themeCheckbox = document.getElementById(
    "theme-toggle"
  ) as HTMLInputElement;
  if (themeCheckbox) {
    themeCheckbox.addEventListener("change", () => {
      document.documentElement.setAttribute(
        "data-theme",
        themeCheckbox.checked ? "dark" : "light"
      );
    });
  }
});
