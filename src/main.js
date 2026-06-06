import './styles/variables.css';
import './styles/animations.css';
import './styles/base.css';
import './styles/nav.css';
import './styles/home.css';
import './styles/scan.css';
import './styles/bpom.css';
import './styles/alarm.css';
import './styles/diary.css';
import './styles/profile.css';
import './styles/onboarding.css';
import './styles/auth.css';
import './styles/recommendations.css';
import './styles/routine.css';
import './styles/subscription.css';
import './styles/product-detail.css';
import { createBottomNav } from './components/BottomNav.js';
import { renderHome } from './pages/Home.js';
import { renderSkinScan } from './pages/SkinScan.js';
import { renderBpomCheck } from './pages/BpomCheck.js';
import { renderSunscreenAlarm } from './pages/SunscreenAlarm.js';
import { renderSkinDiary } from './pages/SkinDiary.js';
import { renderProfile } from './pages/Profile.js';
import { renderOnboarding } from './pages/Onboarding.js';
import { renderLogin } from './pages/Login.js';
import { renderRegister } from './pages/Register.js';
import { renderRecommendations } from './pages/Recommendations.js';
import { renderRoutine } from './pages/Routine.js';
import { renderSettings } from './pages/Settings.js';
import { renderSubscription } from './pages/Subscription.js';
import { renderProductDetail } from './pages/ProductDetail.js';

const app = document.querySelector('#app');

// ─── No-nav routes (onboarding, auth) ───
const noNavRoutes = ['onboarding', 'login', 'register', 'subscription', 'product-detail'];

// ─── Route → tab mapping ───
const tabMap = {
  '': 'home',
  'scan': 'scan',
  'routine': 'routine',
  'profile': 'profile',
  'settings': 'profile',
  'bpom': 'profile',
  'alarm': 'profile',
  'diary': 'profile',
  'recommendations': 'recommendations',
};

function handleRoute() {
  const hash = window.location.hash.slice(2) || '';
  const route = hash.split('?')[0];

  // Auth & onboarding guard
  const isOnboarded = localStorage.getItem('bglow_onboarded');
  const isAuth = localStorage.getItem('bglow_auth');

  if (!isOnboarded && route !== 'onboarding' && route !== 'login' && route !== 'register') {
    window.location.hash = '#/onboarding';
    return;
  }
  if (isOnboarded && !isAuth && !noNavRoutes.includes(route)) {
    window.location.hash = '#/login';
    return;
  }

  app.innerHTML = '';
  let pageEl;

  switch (route) {
    case 'onboarding': pageEl = renderOnboarding(); break;
    case 'login': pageEl = renderLogin(); break;
    case 'register': pageEl = renderRegister(); break;
    case 'scan': pageEl = renderSkinScan(); break;
    case 'bpom': pageEl = renderBpomCheck(); break;
    case 'alarm': pageEl = renderSunscreenAlarm(); break;
    case 'diary': pageEl = renderSkinDiary(); break;
    case 'profile': pageEl = renderProfile(); break;
    case 'recommendations': pageEl = renderRecommendations(); break;
    case 'routine': pageEl = renderRoutine(); break;
    case 'settings': pageEl = renderSettings(); break;
    case 'subscription': pageEl = renderSubscription(); break;
    case 'product-detail': pageEl = renderProductDetail(); break;
    default: pageEl = renderHome(); break;
  }

  app.appendChild(pageEl);

  // Add bottom nav for authenticated routes
  if (!noNavRoutes.includes(route)) {
    const activeTab = tabMap[route] || 'home';
    app.appendChild(createBottomNav(activeTab));
  }
}

window.addEventListener('hashchange', handleRoute);
handleRoute();
