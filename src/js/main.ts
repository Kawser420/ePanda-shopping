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
    this.setupServiceWorker();
  }

  private async setupServiceWorker(): Promise<void> {
    if ("serviceWorker" in navigator) {
      try {
        await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        console.log("Service Worker registered successfully");
      } catch (error) {
        console.log("Service Worker registration failed:", error);
      }
    }
  }

  private loadFromStorage(): void {
    const storedItems = localStorage.getItem(this.storageKey);
    if (storedItems) {
      try {
        this.items = JSON.parse(storedItems);
      } catch (e) {
        console.error("Error parsing cart items from localStorage", e);
        this.items = [];
      }
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

  getItems(): Product[] {
    return [...this.items];
  }

  clear(): void {
    this.items = [];
    this.saveToStorage();
    this.updateCartUI();
  }

  private updateCartUI(): void {
    const cartBadge = document.querySelector(".indicator-item");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    const countStr = this.getItemCount().toString();
    const totalStr = this.getTotal().toFixed(2);

    if (cartBadge) {
      cartBadge.textContent = countStr;
    }
    if (cartCount) {
      cartCount.textContent = countStr;
    }
    if (cartTotal) {
      cartTotal.textContent = totalStr;
    }

    // Dispatch custom event for Alpine.js components
    document.dispatchEvent(
      new CustomEvent("cart-updated", {
        detail: { count: this.getItemCount(), total: this.getTotal() },
      })
    );
  }

  private showNotification(message: string): void {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = "alert alert-success mb-2 animate-fade-in";
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("opacity-0");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
}

// Initialize cart
const cart = new ShoppingCart();

// Export for global access if needed
declare global {
  interface Window {
    cart: ShoppingCart;
  }
}
window.cart = cart;

// Performance monitoring
const reportWebVitals = (): void => {
  if ("webVitals" in window) {
    (window as any).webVitals.getCLS(console.log);
    (window as any).webVitals.getFID(console.log);
    (window as any).webVitals.getFCP(console.log);
    (window as any).webVitals.getLCP(console.log);
    (window as any).webVitals.getTTFB(console.log);
  }
};

// Lazy loading for images
const initLazyLoading = (): void => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || img.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
  }
};

// Add event listeners after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("ePanda Shopping initialized");

  // Initialize lazy loading
  initLazyLoading();

  // Report web vitals in development
  if (process.env.NODE_ENV === "development") {
    reportWebVitals();
  }

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
        const price = parseFloat(priceText.replace("$", "").replace(",", ""));
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
    <label class="swap swap-rotate btn btn-circle glass">
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

  // Check for saved theme preference or respect OS preference
  const savedTheme = localStorage.getItem("theme");
  const osPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const initialTheme = savedTheme || osPreference;

  if (themeCheckbox) {
    themeCheckbox.checked = initialTheme === "dark";
    document.documentElement.setAttribute("data-theme", initialTheme);

    themeCheckbox.addEventListener("change", () => {
      const theme = themeCheckbox.checked ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    });
  }

  // Initialize carousel autoplay
  const initCarousel = (): void => {
    const carousel = document.querySelector(".carousel");
    if (!carousel) return;

    let currentSlide = 1;
    const slideCount = 3;

    setInterval(() => {
      currentSlide = (currentSlide % slideCount) + 1;
      const nextSlide = document.querySelector(`#slide${currentSlide}`);
      if (nextSlide) {
        nextSlide.scrollIntoView({ behavior: "smooth" });
      }
    }, 5000);
  };

  initCarousel();

  // Add animation on scroll
  const animateOnScroll = (): void => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll(".card, .hero-content").forEach((el) => {
      observer.observe(el);
    });
  };

  animateOnScroll();
});

// Service Worker for PWA functionality
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Export for modules
export { ShoppingCart };
export type { Product };
