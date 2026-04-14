<template>
  <div class="system-migration-container">
    <div class="notification-card">
      <!-- Header with icon -->
      <div class="header-section">
        <div class="icon-wrapper">
          <i class="fas fa-rocket"></i>
        </div>
        <h1 class="title">Update System !</h1>
        <p class="subtitle">Saya telah meningkatkan performa sistem untuk pengalaman yang lebih optimal dan cepat</p>
      </div>

      <!-- Information cards -->
      <!-- <div class="info-cards">
        <div class="info-card">
          <div class="info-icon">
            <i class="fas fa-bolt"></i>
          </div>
          <h3>Lebih Cepat</h3>
          <p>Performa sistem yang ditingkatkan hingga 3x lebih cepat dari sebelumnya</p>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h3>Lebih Aman</h3>
          <p>Keamanan data yang lebih baik dengan enkripsi terkini</p>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <i class="fas fa-magic"></i>
          </div>
          <h3>Lebih Modern</h3>
          <p>Antarmuka yang lebih intuitif dan mudah digunakan</p>
        </div>

        <div class="info-card">
          <div class="info-icon">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <h3>Responsif</h3>
          <p>Akses dari perangkat apapun dengan tampilan yang optimal</p>
        </div>
      </div> -->

      <!-- Important notice -->
      <div class="notice-box">
        <i class="fas fa-info-circle"></i>
        <div class="notice-content">
          <h4>Pemberitahuan Penting</h4>
          <p>
            Sistem atau Url yang lama akan <strong>dihentikan penggunaannya</strong> dan telah digantikan dengan sistem yang lebih optimal dan cepat. 
            Silakan akses sistem baru melalui tautan di bawah ini untuk melanjutkan aktivitas Anda.
          </p>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="action-section">
        <a :href="newSystemUrl" target="_blank" class="btn-primary">
          <i class="fas fa-external-link-alt"></i>
          Akses Sistem Baru
        </a>
        <div class="url-display">
          <p>URL Sistem Baru:</p>
          <code>{{ newSystemUrl }}</code>
          <button @click="copyUrl" class="btn-copy" :class="{ copied: copied }">
            <i :class="copied ? 'fas fa-check' : 'fas fa-copy'"></i>
            {{ copied ? 'Tersalin!' : 'Salin URL' }}
          </button>
        </div>
        
        <div class="divider">
          <span>atau</span>
        </div>
        
        <router-link to="/old" class="btn-secondary">
          <i class="fas fa-history"></i>
          Lanjutkan ke Sistem Lama
        </router-link>
        <p class="old-system-note">
          <i class="fas fa-exclamation-triangle"></i>
          Sistem lama akan segera dihentikan. Silakan migrasi ke sistem baru.
        </p>
      </div>

      <!-- Footer -->
      <div class="footer-section">
        <p>
          Jika Anda memiliki pertanyaan atau membutuhkan bantuan, silakan hubungi Sugiyono.
        </p>
        <p class="thank-you">Terima kasih atas pengertian dan kerjasamanya! 🙏</p>
      </div>
    </div>

    <!-- Decorative background elements -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Get URL from environment variable
const newSystemUrl = ref(import.meta.env.VITE_NEW_SYSTEM_URL || 'https://sistem-baru-anda.com')

const copied = ref(false)

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(newSystemUrl.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = newSystemUrl.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<style scoped>
.system-migration-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.notification-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 10;
  animation: slideIn 0.6s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.icon-wrapper {
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

.icon-wrapper i {
  font-size: 50px;
  color: white;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(102, 126, 234, 0);
  }
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 18px;
  color: #718096;
  margin: 0;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.info-card {
  background: #f7fafc;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.info-card:hover {
  transform: translateY(-5px);
  border-color: #667eea;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
}

.info-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon i {
  font-size: 28px;
  color: white;
}

.info-card h3 {
  font-size: 18px;
  color: #2d3748;
  margin: 0 0 10px 0;
}

.info-card p {
  font-size: 14px;
  color: #718096;
  margin: 0;
  line-height: 1.5;
}

.notice-box {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
}

.notice-box i {
  font-size: 30px;
  color: #ffc107;
  flex-shrink: 0;
}

.notice-content h4 {
  font-size: 18px;
  color: #856404;
  margin: 0 0 10px 0;
}

.notice-content p {
  font-size: 15px;
  color: #856404;
  margin: 0;
  line-height: 1.6;
}

.action-section {
  text-align: center;
  margin-bottom: 40px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 18px 40px;
  border-radius: 50px;
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  margin-bottom: 20px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.url-display {
  background: #f7fafc;
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
}

.url-display p {
  font-size: 14px;
  color: #718096;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.url-display code {
  display: block;
  background: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #667eea;
  word-break: break-all;
  margin-bottom: 10px;
  border: 2px solid #e2e8f0;
}

.btn-copy {
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-copy:hover {
  background: #764ba2;
}

.btn-copy.copied {
  background: #48bb78;
}

.divider {
  display: flex;
  align-items: center;
  margin: 30px 0;
  color: #a0aec0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.divider span {
  padding: 0 15px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: white;
  color: #667eea;
  padding: 15px 35px;
  border-radius: 50px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid #667eea;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #f7fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.old-system-note {
  margin-top: 15px;
  font-size: 14px;
  color: #e53e3e;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: #fff5f5;
  border-radius: 8px;
  border: 1px solid #fed7d7;
}

.old-system-note i {
  font-size: 16px;
}

.footer-section {
  text-align: center;
  padding-top: 30px;
  border-top: 2px solid #e2e8f0;
}

.footer-section p {
  font-size: 15px;
  color: #718096;
  margin: 0 0 10px 0;
  line-height: 1.6;
}

.thank-you {
  font-size: 18px !important;
  font-weight: 600;
  color: #667eea !important;
  margin-top: 20px !important;
}

.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 10%;
  left: 30%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .notification-card {
    padding: 30px 20px;
  }

  .title {
    font-size: 28px;
  }

  .subtitle {
    font-size: 16px;
  }

  .info-cards {
    grid-template-columns: 1fr;
  }

  .btn-primary {
    font-size: 16px;
    padding: 15px 30px;
  }
}
</style>
