import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// الربط المباشر بقاعدة بيانات مشروعك jaleed-event
const firebaseConfig = {
  apiKey: "AIzaSyCuj5OVlYi6HxcYpRcDRDSI0vd--eQZWbc",
  authDomain: "jaleed-event.firebaseapp.com",
  projectId: "jaleed-event",
  storageBucket: "jaleed-event.firebasestorage.app",
  messagingSenderId: "46385770939",
  appId: "1:46385770939:web:20bfd36ea0e031ed15149e",
  measurementId: "G-QP4ZFKC43T"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let selectedStars = 0;

const stars = document.querySelectorAll('.star');
stars.forEach(star => {
    star.addEventListener('click', (e) => {
        selectedStars = e.target.getAttribute('data-value');
        
        stars.forEach(s => s.classList.remove('active'));
        e.target.classList.add('active');
    });
});

document.getElementById('submit-vote-btn').addEventListener('click', () => {
    const selectedFlavor = document.querySelector('input[name="flavor"]:checked').value;

    if (selectedStars === 0) {
        alert("الرجاء اختيار تقييم بالنجوم أولاً! ⭐");
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