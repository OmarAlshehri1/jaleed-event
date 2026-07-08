import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// تم وضع رابط الـ databaseURL الصحيح والمفعل هنا
const firebaseConfig = {
  apiKey: "AIzaSyCuj5OVlYi6HxcYpRcDRDSI0vd--eQZWbc",
  authDomain: "jaleed-event.firebaseapp.com",
  databaseURL: "https://jaleed-event-default-rtdb.firebaseio.com", 
  projectId: "jaleed-event",
  storageBucket: "jaleed-event.firebasestorage.app",
  messagingSenderId: "46385770939",
  appId: "1:46385770939:web:20bfd36ea0e031ed15149e",
  measurementId: "G-QP4ZFKC43T"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let selectedStars = 0;
let currentLang = 'ar'; // اللغة الافتراضية هي العربية

// نصوص الواجهة للغتين
const translations = {
    ar: {
        subtitle: "اختر نكهتك المفضلة وقيمها الآن!",
        starsTitle: "اضغط للتقييم بالنجوم:",
        submitBtn: "إرسال التقييم 🚀",
        popupTitle: "شكرًا لك! 🎉",
        popupDesc: "تم إرسال تقييمك بنجاح إلى الشاشة الكبيرة.",
        alertStars: "الرجاء اختيار تقييم بالنجوم أولاً! ⭐",
        toggleBtn: "English"
    },
    en: {
        subtitle: "Choose your favorite flavor and rate it now!",
        starsTitle: "Tap to rate with stars:",
        submitBtn: "Submit Rating 🚀",
        popupTitle: "Thank You! 🎉",
        popupDesc: "Your rating has been successfully sent to the big screen.",
        alertStars: "Please select a star rating first! ⭐",
        toggleBtn: "عربي"
    }
};

// منطق تغيير اللغة
const langBtn = document.getElementById('lang-btn');
langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    
    // تغيير اتجاه الصفحة والنصوص
    if (currentLang === 'ar') {
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
        langBtn.innerText = translations.ar.toggleBtn;
    } else {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
        langBtn.innerText = translations.en.toggleBtn;
    }

    // تحديث نصوص الواجهة
    document.getElementById('text-subtitle').innerText = translations[currentLang].subtitle;
    document.getElementById('text-stars-title').innerText = translations[currentLang].starsTitle;
    document.getElementById('submit-vote-btn').innerText = translations[currentLang].submitBtn;
    document.getElementById('popup-title').innerText = translations[currentLang].popupTitle;
    document.getElementById('popup-desc').innerText = translations[currentLang].popupDesc;

    // تحديث أسماء النكهات
    document.querySelectorAll('.flavor-name').forEach(span => {
        span.innerText = span.getAttribute(`data-${currentLang}`);
    });
});

// نظام النجوم
const stars = document.querySelectorAll('.star');
stars.forEach(star => {
    star.addEventListener('click', (e) => {
        selectedStars = e.target.getAttribute('data-value');
        stars.forEach(s => s.classList.remove('active'));
        e.target.classList.add('active');
    });
});

// إرسال التصويت
document.getElementById('submit-vote-btn').addEventListener('click', () => {
    const selectedFlavor = document.querySelector('input[name="flavor"]:checked').value;

    if (selectedStars === 0) {
        alert(translations[currentLang].alertStars);
        return;
    }

    const votesRef = ref(db, 'votes');
    const newVoteRef = push(votesRef);
    
    set(newVoteRef, {
        flavor: selectedFlavor,
        stars: selectedStars,
        timestamp: Date.now()
    }).then(() => {
        const popup = document.getElementById('success-popup');
        popup.classList.remove('hidden');
        
        setTimeout(() => {
            popup.classList.add('hidden');
            selectedStars = 0;
            stars.forEach(s => s.classList.remove('active'));
        }, 2500);
    }).catch(error => {
        console.error("Error sending vote:", error);
    });
});