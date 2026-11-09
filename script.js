let isLoggedIn = false;
let userName = '';

// State Management
let activeTab = 'home';
let selectedImage = null;
let isAnalyzing = false;
let analysisResult = null;

// Mock Wildlife Data & Trash Category Database
const trashDatabase = {
  bottle: {
    name: 'ขวดพลาสติก / กระป๋อง',
    dangerLevel: 'สูง',
    impactedGroups: ['สัตว์ครึ่งบกครึ่งน้ำ (น้องนาก)', 'สัตว์ตัวเล็ก'],
    impactDetail: 'สัตว์ตัวเล็กมักซุกตัวเข้าไปหาเศษอาหารข้างใน แล้วติดขัดออกมาไม่ได้ หรือโดนขอบคมบาด',
    preventionTips: [
      'ล้างทำความสะอาดเศษอาหารข้างใน',
      'บีบขวดให้แบนเพื่อลดปริมาตร',
      'ปิดฝาขวดให้แน่นก่อนนำไปรีไซเคิล'
    ]
  },
  bag: {
    name: 'ถุงพลาสติก / ซองขนม',
    dangerLevel: 'วิกฤต',
    impactedGroups: ['สัตว์น้ำ / ปลา', 'นกทะเล'],
    impactDetail: 'ปลาและนกทะเลเข้าใจผิดคิดว่าเป็นอาหาร (แมงกะพรุน) เมื่อกินเข้าไปจะอุดตันในกระเพาะจนอาหารไม่ย่อย',
    preventionTips: [
      'ม้วนถุงพลาสติกเป็นปมแน่นๆ ก่อนทิ้ง',
      'ทิ้งในถุงขยะแยกเฉพาะเพื่อไม่ให้ปลิวลงน้ำ'
    ]
  },
  straw: {
    name: 'หลอดพลาสติก / ห่วงรัดฝา',
    dangerLevel: 'สูงมาก',
    impactedGroups: ['นกทะเล', 'สัตว์น้ำ / ปลา'],
    impactDetail: 'ห่วงพลาสติกอาจพันรัดปากหรือลำตัวของสัตว์ และปลายหลอดที่คมอาจทิ่มแทงอวัยวะภายใน',
    preventionTips: [
      'ใช้กรรไกรตัดห่วงพลาสติกให้ขาดออกจากกันก่อนทิ้ง',
      'ตัดหลอดพลาสติกเป็นชิ้นเล็กๆ'
    ]
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  renderContent();
  updateNavUI();
});

// Switch Active Tab
function switchTab(tabId) {
  activeTab = tabId;
  updateNavUI();
  renderContent();
}

// Update Navigation Color States & Bottom Nav UI
function updateNavUI() {
  const tabs = ['home', 'scan', 'wildlife', 'about'];
  
  tabs.forEach(tab => {
    const btn = document.getElementById(`nav-${tab}`);
    if (btn) {
      if (tab === activeTab) {
        btn.classList.add('active');
        btn.classList.remove('inactive');
      } else {
        btn.classList.add('inactive');
        btn.classList.remove('active');
      }
    }
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Render Content dynamically based on activeTab
function renderContent() {
  const main = document.getElementById('main-content');
  if (!main) return;
  
  // ถ้ายังไม่ได้ล็อกอิน ให้แสดงหน้า Login และซ่อนเมนูด้านล่าง
  if (!isLoggedIn) {
    main.innerHTML = getLoginHTML();
    const nav = document.querySelector('nav');
    if (nav) nav.parentElement.style.display = 'none';
    if (window.lucide) lucide.createIcons();
    return;
  }

  // ถ้าล็อกอินแล้ว ให้แสดงเมนูด้านล่างตามปกติ
  const nav = document.querySelector('nav');
  if (nav) nav.parentElement.style.display = 'block';

  if (activeTab === 'home') {
    main.innerHTML = getHomeHTML();
  } else if (activeTab === 'scan') {
    main.innerHTML = getScanHTML();
  } else if (activeTab === 'wildlife') {
    main.innerHTML = getWildlifeHTML();
  } else if (activeTab === 'about') {
    main.innerHTML = getAboutHTML();
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

// 1. Home Page HTML (Styled like reference design)
function getHomeHTML() {
  return `
    <div class="space-y-4">
      <!-- Top Hero Card with Cute Illustration & Pill Badge -->
      <div class="clay-card-orange p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[220px]">
        <div class="flex justify-between items-start z-10">
          <span class="bg-white/30 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/40">
            สำรวจธรรมชาติ ✨
          </span>
        </div>

        <div class="z-10 mt-4">
          <h2 class="font-['Mali'] font-bold text-2xl leading-tight mb-1 text-white">
            รับผิดชอบขยะของเรา<br>เพื่อรักษาชีวิตของพวกเขา
          </h2>
          <p class="text-xs text-white/90 font-light">มาร่วมเปลี่ยนโลกให้น่าอยู่ขึ้นกันนะ!</p>
        </div>

        <button onclick="switchTab('scan')" class="z-10 mt-4 bg-white text-[#F58A4B] hover:bg-white/90 font-bold py-2.5 px-5 rounded-full shadow-lg text-xs self-start flex items-center gap-2">
          เริ่มสแกนขยะ <i data-lucide="arrow-right" class="w-4 h-4"></i>
        </button>

        <div class="absolute -right-4 -bottom-6 text-8xl opacity-90 select-none pointer-events-none">
          🦦
        </div>
      </div>

      <!-- Overlapping Floating Card Section -->
      <div class="clay-card p-5 space-y-3 -mt-2 relative z-20">
        <div class="flex items-center justify-between">
          <h3 class="font-['Mali'] font-bold text-sm text-[#355C41]">ขยะยอดนิยมที่พบ</h3>
          <span class="text-[11px] text-[#5C402E]/60">3 ชนิดอันตราย</span>
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div onclick="selectSample('bottle')" class="bg-[#FFF9ED] p-3 rounded-2xl text-center border border-[#A8C8A0]/20 cursor-pointer hover:scale-105 transition-all">
            <div class="text-2xl mb-1">🍾</div>
            <span class="text-[11px] font-medium text-[#5C402E] block">ขวดพลาสติก</span>
          </div>

          <div onclick="selectSample('bag')" class="bg-[#FFF9ED] p-3 rounded-2xl text-center border border-[#A8C8A0]/20 cursor-pointer hover:scale-105 transition-all">
            <div class="text-2xl mb-1">🛍️</div>
            <span class="text-[11px] font-medium text-[#5C402E] block">ถุงพลาสติก</span>
          </div>

          <div onclick="selectSample('straw')" class="bg-[#FFF9ED] p-3 rounded-2xl text-center border border-[#A8C8A0]/20 cursor-pointer hover:scale-105 transition-all">
            <div class="text-2xl mb-1">🥤</div>
            <span class="text-[11px] font-medium text-[#5C402E] block">หลอดพลาสติก</span>
          </div>
        </div>
      </div>

      <!-- Two Column Stats Card -->
      <div class="grid grid-cols-2 gap-3">
        <div class="clay-card p-4 flex flex-col justify-between">
          <div class="flex justify-between items-center text-xs text-[#5C402E]/60 mb-2">
            <span>ผลกระทบ</span>
            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
          </div>
          <p class="font-['Mali'] font-bold text-2xl text-[#355C41]">80%</p>
          <span class="text-[10px] text-[#5C402E]/70">ขยะหลุดลงสู่สายน้ำ</span>
        </div>

        <div class="clay-card p-4 flex flex-col justify-between">
          <div class="flex justify-between items-center text-xs text-[#5C402E]/60 mb-2">
            <span>สัตว์ที่เสี่ยง</span>
            <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i>
          </div>
          <p class="font-['Mali'] font-bold text-2xl text-[#F58A4B]">100+</p>
          <span class="text-[10px] text-[#5C402E]/70">สายพันธุ์ได้รับอันตราย</span>
        </div>
      </div>
    </div>
  `;
}
// 2. Scan Page HTML
function getScanHTML() {
  if (analysisResult) {
    return getResultHTML();
  }

  return `
    <div class="space-y-4">
      <div class="clay-card p-5 text-center">
        <h2 class="font-['Mali'] font-bold text-lg text-[#355C41] mb-1">สแกนขยะพลาสติก 📸</h2>
        <p class="text-xs text-[#5C402E]/70 mb-4">ถ่ายรูปหรือเลือกรูปขยะ เพื่อดูผลกระทบต่อสัตว์ป่า</p>

        <div class="border-2 border-dashed border-[#A8C8A0] bg-[#CDE8D1]/10 rounded-3xl p-6 text-center hover:bg-[#CDE8D1]/20 transition-all cursor-pointer relative">
          <input type="file" accept="image/*" onchange="handleImageSelect(event)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
          ${selectedImage ? `
            <img src="${selectedImage}" class="max-h-48 mx-auto rounded-2xl shadow-sm mb-3 object-cover">
            <p class="text-xs text-[#355C41] font-semibold">เปลี่ยนรูปภาพ</p>
          ` : `
            <div class="w-12 h-12 rounded-full bg-[#CDE8D1] text-[#355C41] flex items-center justify-center mx-auto mb-2">
              <i data-lucide="camera" class="w-6 h-6"></i>
            </div>
            <p class="text-xs font-semibold text-[#355C41]">แตะเพื่ออัปโหลดรูปภาพ</p>
            <p class="text-[10px] text-[#5C402E]/60 mt-1">รองรับ JPG, PNG</p>
          `}
        </div>
      </div>

      <div class="clay-card p-4">
        <p class="text-xs font-semibold text-[#5C402E]/80 mb-2">เลือกรูปตัวอย่างทดสอบด่วน:</p>
        <div class="grid grid-cols-3 gap-2">
          <button onclick="selectSample('bottle')" class="bg-[#FFF9ED] p-2.5 rounded-2xl border border-[#A8C8A0]/30 text-center hover:border-[#355C41]">
            <div class="text-xl">🍾</div>
            <span class="text-[10px] text-[#5C402E]">ขวดพลาสติก</span>
          </button>
          <button onclick="selectSample('bag')" class="bg-[#FFF9ED] p-2.5 rounded-2xl border border-[#A8C8A0]/30 text-center hover:border-[#355C41]">
            <div class="text-xl">🛍️</div>
            <span class="text-[10px] text-[#5C402E]">ถุงพลาสติก</span>
          </button>
          <button onclick="selectSample('straw')" class="bg-[#FFF9ED] p-2.5 rounded-2xl border border-[#A8C8A0]/30 text-center hover:border-[#355C41]">
            <div class="text-xl">🥤</div>
            <span class="text-[10px] text-[#5C402E]">หลอดพลาสติก</span>
          </button>
        </div>
      </div>

      ${selectedImage ? `
        <button onclick="runAnalysis()" class="w-full bg-[#355C41] text-[#FFF9ED] font-semibold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm">
          <i data-lucide="sparkles" class="w-4 h-4"></i>
          วิเคราะห์ผลกระทบด้วย AI
        </button>
      ` : ''}
    </div>
  `;
}

// 3. Analysis Results HTML
function getResultHTML() {
  const res = analysisResult;
  return `
    <div class="space-y-4">
      <div class="clay-card p-5 space-y-3">
        <div class="flex items-center gap-3 border-b border-[#A8C8A0]/20 pb-3">
          <span class="text-3xl">⚠️</span>
          <div>
            <h3 class="font-['Mali'] font-bold text-sm text-[#355C41]">${res.name}</h3>
            <p class="text-[10px] text-rose-500 font-semibold">ระดับอันตราย: ${res.dangerLevel}</p>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-bold text-[#5C402E] mb-1">กลุ่มสัตว์ที่ได้รับผลกระทบหลัก:</h4>
          <div class="flex flex-wrap gap-1 mb-2">
            ${res.impactedGroups.map(g => `<span class="bg-[#F8DDD0] text-[#5C402E] text-[10px] px-2 py-0.5 rounded-full font-medium">${g}</span>`).join('')}
          </div>
          <p class="text-xs text-[#5C402E]/80 leading-relaxed">${res.impactDetail}</p>
        </div>

        <div class="bg-[#CDE8D1]/30 p-3.5 rounded-2xl">
          <h4 class="text-xs font-bold text-[#355C41] mb-1">วิธีจัดการก่อนทิ้งเพื่อความปลอดภัย:</h4>
          <ul class="text-xs text-[#5C402E]/80 space-y-1.5">
            ${res.preventionTips.map(tip => `<li class="flex items-center gap-1.5"><span class="text-[#355C41]">✓</span> ${tip}</li>`).join('')}
          </ul>
        </div>
      </div>

      <button onclick="resetAnalysis()" class="w-full bg-white border border-[#355C41] text-[#355C41] font-semibold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1 shadow-sm">
        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> สแกนขยะชิ้นอื่น
      </button>
    </div>
  `;
}

// 4. Wildlife Gallery HTML
function getWildlifeHTML() {
  return `
    <div class="space-y-3">
      <h2 class="font-['Mali'] font-bold text-base text-[#355C41] mb-2">กลุ่มสัตว์ที่เสี่ยงจากขยะป่า 🐾</h2>
      
      <div class="clay-card p-4 flex gap-3 items-center">
        <div class="text-3xl">🦦</div>
        <div>
          <h3 class="font-['Mali'] font-bold text-xs text-[#355C41]">สัตว์ครึ่งบกครึ่งน้ำ (น้องนาก)</h3>
          <p class="text-[10px] text-[#5C402E]/70 mt-0.5">เสี่ยงถูกสายรัด ห่วงพลาสติก หรือเศษตาข่ายพันลำตัวขณะว่ายน้ำ</p>
        </div>
      </div>

      <div class="clay-card p-4 flex gap-3 items-center">
        <div class="text-3xl">🐦</div>
        <div>
          <h3 class="font-['Mali'] font-bold text-xs text-[#355C41]">กลุ่มนกทะเล</h3>
          <p class="text-[10px] text-[#5C402E]/70 mt-0.5">เข้าใจผิดคิดว่าเศษพลาสติกเล็กๆ เป็นอาหาร นำไปป้อนลูกนก</p>
        </div>
      </div>

      <div class="clay-card p-4 flex gap-3 items-center">
        <div class="text-3xl">🐟</div>
        <div>
          <h3 class="font-['Mali'] font-bold text-xs text-[#355C41]">สัตว์น้ำและกลุ่มปลา</h3>
          <p class="text-[10px] text-[#5C402E]/70 mt-0.5">กินเศษถุงพลาสติกที่เข้าใจว่าเป็นแมงกะพรุนอุดตันลำไส้</p>
        </div>
      </div>
    </div>
  `;
}
// 5. About HTML
function getAboutHTML() {
  return `
    <div class="space-y-4 text-center">
      <div class="w-16 h-16 bg-[#CDE8D1] rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm">🌱</div>
      <div>
        <h2 class="font-['Mali'] font-bold text-lg text-[#355C41]">Trash to Nature</h2>
        <p class="text-xs text-[#5C402E]/70 mt-1">See the Trash, Save the Wildlife</p>
      </div>

      <div class="clay-card p-4 text-left space-y-2 text-xs text-[#5C402E]/80">
        <p><strong>วัตถุประสงค์:</strong> โครงสร้างสื่อเรียนรู้วิธีการทิ้งขยะที่ปลอดภัย เพื่อลดผลกระทบอันตรายต่อกลุ่มสัตว์ป่า</p>
        <p><strong>พัฒนาโดย:</strong> MDT(Media Technology) - KMUTT</p>
      </div>
    </div>
  `;
}

// Event Handlers
function handleImageSelect(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      selectedImage = event.target.result;
      analysisResult = trashDatabase.bottle; // Mock default AI result
      renderContent();
    };
    reader.readAsDataURL(file);
  }
}

function selectSample(type) {
  if (type === 'bottle') {
    selectedImage = 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=400';
    analysisResult = trashDatabase.bottle;
  } else if (type === 'bag') {
    selectedImage = 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=400';
    analysisResult = trashDatabase.bag;
  } else if (type === 'straw') {
    selectedImage = 'https://images.unsplash.com/photo-1574063413132-355dbfd83e07?auto=format&fit=crop&q=80&w=400';
    analysisResult = trashDatabase.straw;
  }
  renderContent();
}

function runAnalysis() {
  if (!analysisResult) {
    analysisResult = trashDatabase.bottle;
  }
  renderContent();
}

function resetAnalysis() {
  selectedImage = null;
  analysisResult = null;
  renderContent();
}

// หน้า Login HTML
function getLoginHTML() {
  return `
    <div class="space-y-5 pt-2 px-1">
      <div class="text-center space-y-2">
        <div class="relative w-24 h-24 mx-auto">
          <div class="w-24 h-24 rounded-full bg-[#CDE8D1] flex items-center justify-center text-5xl shadow-md border-4 border-white animate-bounce">
            🦦
          </div>
          <span class="absolute bottom-0 right-0 bg-[#F58A4B] text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
            Hi!
          </span>
        </div>
        <h2 class="font-['Mali'] font-bold text-xl text-[#355C41]">ยินดีต้อนรับครับ!</h2>
        <p class="text-xs text-[#5C402E]/70">เข้าสู่ระบบเพื่อมาร่วมปกป้องน้องๆ สัตว์ป่ากันนะ</p>
      </div>

      <div class="clay-card p-6 space-y-4">
        <form onsubmit="handleLogin(event)" class="space-y-3">
          <div>
            <label class="block text-[11px] font-semibold text-[#5C402E] mb-1 ml-1">ชื่อผู้ใช้งาน / อีเมล</label>
            <div class="relative flex items-center">
              <input type="text" id="login-username" required placeholder="เช่น น้องนากสุดน่ารัก" class="clay-input w-full pl-10">
              <i data-lucide="user" class="w-4 h-4 absolute left-3.5 text-[#355C41]/60"></i>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-[#5C402E] mb-1 ml-1">รหัสผ่าน</label>
            <div class="relative flex items-center">
              <input type="password" required placeholder="••••••••" class="clay-input w-full pl-10">
              <i data-lucide="lock" class="w-4 h-4 absolute left-3.5 text-[#355C41]/60"></i>
            </div>
          </div>

          <div class="flex justify-between items-center text-[11px] px-1 pt-1">
            <label class="flex items-center gap-1.5 text-[#5C402E]/80 cursor-pointer">
              <input type="checkbox" class="rounded border-[#A8C8A0] text-[#355C41] focus:ring-0"> Remember me
            </label>
            <a href="#" onclick="alert('ระบบจะส่งลิงก์ตั้งรหัสผ่านใหม่ไปที่อีเมลของคุณ')" class="text-[#355C41] font-semibold hover:underline">ลืมรหัสผ่าน?</a>
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-[#F58A4B] to-[#FF9E66] hover:opacity-95 text-white font-bold py-3 rounded-full shadow-lg text-sm flex items-center justify-center gap-2 mt-2 transition-all active:scale-95">
            <span>เข้าสู่ระบบ</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </form>

        <div class="flex items-center my-3">
          <div class="flex-1 border-t border-[#5C402E]/10"></div>
          <span class="px-3 text-[10px] text-[#5C402E]/50 font-medium">หรือเข้าสู่ระบบด้วย</span>
          <div class="flex-1 border-t border-[#5C402E]/10"></div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button onclick="quickSocialLogin('Google User')" class="social-btn">
            <span class="text-base">🌐</span>
            <span>Google</span>
          </button>
          <button onclick="quickSocialLogin('LINE User')" class="social-btn">
            <span class="text-base">💬</span>
            <span>LINE</span>
          </button>
        </div>
      </div>

      <p class="text-center text-xs text-[#5C402E]/70">
        ยังไม่มีบัญชีใช่ไหม? <a href="#" onclick="quickSocialLogin('เพื่อนใหม่'); return false;" class="text-[#355C41] font-bold underline">สมัครสมาชิกฟรี</a>
      </p>
    </div>
  `;
}

// ฟังก์ชันสำหรับล็อกอิน
function handleLogin(e) {
  e.preventDefault();
  const input = document.getElementById('login-username');
  userName = input && input.value ? input.value : 'นักอนุรักษ์รุ่นจิ๋ว';
  isLoggedIn = true;

  updateHeaderUI();
  renderContent();
}

function quickSocialLogin(providerName) {
  userName = providerName;
  isLoggedIn = true;
  
  updateHeaderUI();
  renderContent();
}

// ฟังก์ชันออกจากระบบ
function logout() {
  isLoggedIn = false;
  userName = '';
  activeTab = 'home';
  
  updateHeaderUI();
  renderContent();
}

// ฟังก์ชันอัปเดตข้อความ Header ด้านบน
function updateHeaderUI() {
  const greetingEl = document.getElementById('user-greeting');
  const nameEl = document.getElementById('user-display-name');
  const logoutBtn = document.getElementById('logout-btn');

  if (isLoggedIn) {
    // ถ้าล็อกอินแล้ว -> Hello, [ชื่อผู้ใช้] + แสดงปุ่ม Logout
    if (greetingEl) greetingEl.innerText = 'Hello,';
    if (nameEl) nameEl.innerText = userName;
    if (logoutBtn) logoutBtn.classList.remove('hidden');
  } else {
    // ถ้ายังไม่ล็อกอิน -> Hello, Welcome to PAWLANET + ซ่อนปุ่ม Logout
    if (greetingEl) greetingEl.innerText = 'Hello,';
    if (nameEl) nameEl.innerText = 'Welcome to PAWLANET';
    if (logoutBtn) logoutBtn.classList.add('hidden');
  }
}