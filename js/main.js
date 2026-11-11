/**
 * GURU MEN'S WEAR (GMW) - OFFICIAL JAVASCRIPT ENGINE
 * Handles interactive calculator, WhatsApp bridging, gallery filters, 
 * lightbox modals, and mobile navigation.
 */

const GMW_CONFIG = {
    shopName: "Guru Men's Wear (GMW)",
    whatsappNumber: "918722273051", // Dad's WhatsApp
    phone1: "+91 8722273051",
    phone2: "+91 6362729684",
    email: "gurumenswear@gmail.com",
    address: "Jamadar Complex, Noubad, Bidar - 585401"
};

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initOrderCalculator();
    initBookingForm();
    initGallery();
    initContactForm();
});

/* ==========================================================================
   1. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const mobileNav = document.querySelector('.mobile-nav');

    if (!toggleBtn || !mobileNav) return;

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileNav.classList.toggle('open');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        }
    });

    // Close when clicking outside content
    mobileNav.addEventListener('click', (e) => {
        if (e.target === mobileNav) {
            mobileNav.classList.remove('open');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        }
    });

    // Close on link click
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
        });
    });
}

/* ==========================================================================
   2. INTERACTIVE ORDER & PRICE CALCULATOR (REAL-TIME + WHATSAPP BRIDGE)
   ========================================================================== */
function initOrderCalculator() {
    const calcWrapper = document.querySelector('.calc-wrapper');
    if (!calcWrapper) return;

    const cards = document.querySelectorAll('.calc-item-card');
    const totalAmountEl = document.getElementById('calcTotalAmount');
    const totalCountEl = document.getElementById('calcTotalCount');
    const whatsappBtn = document.getElementById('btnSubmitOrder');

    function calculateTotal() {
        let grandTotal = 0;
        let totalItems = 0;

        cards.forEach(card => {
            const price = parseInt(card.dataset.price || '0', 10);
            const input = card.querySelector('.calc-qty-input');
            const totalDisplay = card.querySelector('.calc-item-total');
            const qty = Math.max(0, parseInt(input.value || '0', 10));

            const itemTotal = price * qty;
            grandTotal += itemTotal;
            totalItems += qty;

            if (totalDisplay) {
                totalDisplay.textContent = `₹${itemTotal.toLocaleString('en-IN')}`;
            }

            if (qty > 0) {
                card.classList.add('has-qty');
            } else {
                card.classList.remove('has-qty');
            }
        });

        if (totalAmountEl) {
            totalAmountEl.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
        }
        if (totalCountEl) {
            totalCountEl.textContent = `${totalItems} ${totalItems === 1 ? 'Garment' : 'Garments'} selected`;
        }

        return { grandTotal, totalItems };
    }

    // Attach plus / minus handlers
    cards.forEach(card => {
        const plusBtn = card.querySelector('.calc-btn.plus');
        const minusBtn = card.querySelector('.calc-btn.minus');
        const input = card.querySelector('.calc-qty-input');

        if (plusBtn && input) {
            plusBtn.addEventListener('click', () => {
                let val = parseInt(input.value || '0', 10);
                input.value = val + 1;
                calculateTotal();
            });
        }

        if (minusBtn && input) {
            minusBtn.addEventListener('click', () => {
                let val = parseInt(input.value || '0', 10);
                if (val > 0) {
                    input.value = val - 1;
                    calculateTotal();
                }
            });
        }

        if (input) {
            input.addEventListener('input', () => {
                if (isNaN(input.value) || input.value < 0) {
                    input.value = 0;
                }
                calculateTotal();
            });
        }
    });

    // Handle Order Submission via WhatsApp
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const { grandTotal, totalItems } = calculateTotal();

            if (totalItems === 0) {
                alert("Please select at least 1 garment to customize your stitching order!");
                return;
            }

            const nameInput = document.getElementById('orderCustomerName');
            const phoneInput = document.getElementById('orderCustomerPhone');
            const fabricInput = document.getElementById('orderFabricSource');
            const notesInput = document.getElementById('orderNotes');

            const customerName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : "Valued Customer";
            const customerPhone = phoneInput && phoneInput.value.trim() ? phoneInput.value.trim() : "Not provided";
            const fabricSource = fabricInput ? fabricInput.value : "Bringing my own fabric";
            const notes = notesInput && notesInput.value.trim() ? notesInput.value.trim() : "None";

            // Build itemized list
            let itemsSummary = [];
            cards.forEach(card => {
                const name = card.dataset.name;
                const price = parseInt(card.dataset.price, 10);
                const qty = parseInt(card.querySelector('.calc-qty-input').value || '0', 10);
                if (qty > 0) {
                    itemsSummary.push(`• *${name}*: ${qty} x ₹${price} = ₹${qty * price}`);
                }
            });

            // Format message
            const message = 
`🧵 *NEW STITCHING ORDER - GURU MEN'S WEAR*
---------------------------------------
👤 *Customer:* ${customerName}
📞 *Phone:* ${customerPhone}
🧶 *Fabric:* ${fabricSource}
📝 *Notes:* ${notes}

📦 *ORDERED GARMENTS:*
${itemsSummary.join('\n')}

💰 *ESTIMATED TOTAL: ₹${grandTotal.toLocaleString('en-IN')}*
📊 *Total Pieces: ${totalItems}*
---------------------------------------
📍 Shop: Jamadar Complex, Noubad, Bidar - 585401
🌐 _Order sent via Guru Men's Wear Website_`;

            const whatsappUrl = `https://wa.me/${GMW_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // Initial calculation
    calculateTotal();
}

/* ==========================================================================
   3. APPOINTMENT BOOKING FORM (DIRECT WHATSAPP CONFIRMATION)
   ========================================================================== */
function initBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    if (!bookingForm) return;

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('bookName')?.value.trim() || 'Customer';
        const phone = document.getElementById('bookPhone')?.value.trim() || 'Not specified';
        const service = document.getElementById('bookService')?.value || 'Custom Tailoring';
        const date = document.getElementById('bookDate')?.value || 'Flexible';
        const time = document.getElementById('bookTime')?.value || 'Flexible';
        const notes = document.getElementById('bookNotes')?.value.trim() || 'None';

        const message = 
`📅 *APPOINTMENT / FITTING REQUEST*
*Guru Men's Wear (GMW)*
---------------------------------------
👤 *Customer Name:* ${name}
📞 *Contact Number:* ${phone}
✂️ *Service Needed:* ${service}
🗓️ *Preferred Date:* ${date}
⏰ *Preferred Time:* ${time}
💬 *Specific Details:* ${notes}
---------------------------------------
📍 _Please confirm my fitting slot. Thank you!_`;

        const whatsappUrl = `https://wa.me/${GMW_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}

/* ==========================================================================
   4. FILTERABLE GALLERY & LIGHTBOX MODAL
   ========================================================================== */
function initGallery() {
    const filterBtns = document.querySelectorAll('.gallery-btn');
    const items = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImg');
    const modalCaption = document.getElementById('lightboxCaption');
    const closeBtn = document.getElementById('lightboxClose');

    if (!items.length) return;

    // Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            items.forEach(item => {
                const category = item.dataset.category;
                if (filter === 'all' || category === filter || category.includes(filter)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.4s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox open
    if (modal && modalImg) {
        items.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const title = item.querySelector('.gallery-overlay h4')?.textContent || 'Guru Men\'s Wear Showcase';
                if (img) {
                    modalImg.src = img.src;
                    if (modalCaption) modalCaption.textContent = title;
                    modal.classList.add('active');
                }
            });
        });

        // Close handlers
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        });
    }
}

/* ==========================================================================
   5. CONTACT FORM
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('directContactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName')?.value.trim() || 'Visitor';
        const phone = document.getElementById('contactPhone')?.value.trim() || 'N/A';
        const msg = document.getElementById('contactMessage')?.value.trim() || '';

        const whatsappText = 
`💬 *CUSTOMER INQUIRY - GURU MEN'S WEAR*
---------------------------------------
👤 *From:* ${name}
📞 *Phone:* ${phone}
✉️ *Message:* ${msg}
---------------------------------------
_Sent via Guru Men's Wear Website_`;

        const whatsappUrl = `https://wa.me/${GMW_CONFIG.whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;
        window.open(whatsappUrl, '_blank');
    });
}
