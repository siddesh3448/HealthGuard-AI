import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Sparkles, 
  Activity, 
  Send, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Search, 
  Trash2, 
  ArrowRight, 
  Plus, 
  Grid, 
  FileText, 
  Heart, 
  User, 
  Info, 
  Clock, 
  Smartphone,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Language } from '../context/LanguageContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  type?: 'neutral' | 'clinical-alert' | 'clinical-success' | 'telemetry';
  isSpeaking?: boolean;
}

const AI_TRANSLATIONS: Record<Language, {
  welcome: string;
  peanut: string;
  sodium: string;
  tylenol: string;
  water: string;
  default: string;
  quickQuestions: { label: string; text: string }[];
  templates: { title: string; text: string }[];
}> = {
  en: {
    welcome: 'Greetings John. I am your HealthGuard Clinical Assistant, synchronizing with your active biometric file (32 y/o, 78kg), registered Peanut Allergies, and Mild Hypertension tracks. I have successfully analyzed your active pantry food items and medication dosages. How may I guide your systemic health alignments or dosage schedules today?',
    peanut: '⚠️ PEANUT ALLERGY INTERVENTION ALERT:\n\nOur system has identified a strict "Peanuts" allergy within your persistent profile. Avoid consuming standard nuts, non-refined peanut culinary oils, or processed pantry treats carrying cross-facility warnings. \n\nLooking at your Smart Pantry, the "Chewy Choco Cookies (Premium Pack)" has a highlighted peanut warning. Safe substitute suggestions include sunflower butter, organic pumpkin seeds, or organic tahini paste to maintain high-protein macros without cellular hyper-reactivity.',
    sodium: '💖 HYPERTENSION CARDIO-ALIGNMENT CHECK:\n\nTo manage your Mild Hypertension, you should adhere to a low-sodium lifestyle (recommended maximum limit is 1,500mg daily sodium count).\n\nConsuming potassium-rich counteragents like coconut water or almond milk (both found inside your logged supplies) facilitates tissue sodium clearance, which directly eases vascular load. For meals, prepare with garlic powder, oregano, or organic lemon zest rather than sodium table salt.',
    tylenol: '🚫 DRUG-ENZYME METALLIC WARNING:\n\nYou have Acetaminophen (Tylenol) registered within your medication active schedule. Grapefruit flavonoids are clinical inhibitors of the metabolic intestinal enzyme CYP3A4. Consuming citrus extract within 4 hours of Tylenol will cause abnormal drug concentration ranges. Avoid Grapefruit Tonic Sodas or sour cocktails around dosage timings to prevent excessive hepatic load.',
    water: '💧 SYSTEMIC FLUID BALANCE METALLIC CHECK:\n\nOptimal fluid intake is a powerful non-pharmacological agent against Mild Hypertension. Consistent daily hydration helps dilute overall plasma volume, lowering capillary pressure. Reach for a minimum target of 2.4L daily fluid. Keep an hourly schedule of unsweetened organic green tea or electrolyte balances.',
    default: '🩺 HEALTHGUARD DIGITAL DIAGNOSTIC ANALYSIS:\n\nThank you for reaching out. Based on your active profiles (Peanut allergy, Mild Hypertension), I recommend reviewing the "Smart Pantry" to check if newly logged pantry foods carry any trace allergen risks. \n\nYou can scan clinical packages using our camera scanning dashboards to inspect ingredients and verify therapeutic thresholds before consumption.',
    quickQuestions: [
      { label: '🥜 Peanut Allergies check', text: 'Tell me about peanut allergens and what safe alternatives I have in my pantry.' },
      { label: '💖 Daily Sodium targets', text: 'How does daily sodium intake affect my Mild Hypertension conditions?' },
      { label: '💊 Grapefruit and Tylenol interactions', text: 'Can I consume grapefruit juice near my Tylenol dose timings?' },
      { label: '💧 Water volume benchmarks', text: 'How much daily water is required to align clinical blood pressure indexes?' }
    ],
    templates: [
      { title: 'Evaluate Pantry Bio-Alignment', text: 'Analyze all ingredients stored in my pantry against my registered peanut allergies and dietary restrictions.' },
      { title: 'Verify Medication Dosage Timing', text: 'Show medication guidelines and dangerous cross-reactions for Tylenol.' },
      { title: 'Hypertension Alignment Card', text: 'Draft a visual weekly sodium balance report using products logged to my active pantry.' }
    ]
  },
  hi: {
    welcome: 'नमस्ते जॉन। मैं आपका हेल्थगार्ड क्लिनिकल असिस्टेंट हूँ, जो आपकी सक्रिय बायोमेट्रिक फ़ाइल (32 वर्ष, 78 किग्रा), पंजीकृत मूंगफली एलर्जी, और हल्के उच्च रक्तचाप के ट्रैक के साथ समन्वयित है। मैंने आपकी सक्रिय खाद्य सामग्री और दवा की खुराक का सफलतापूर्वक विश्लेषण किया है। आज मैं आपके स्वास्थ्य संरेखण या खुराक के शेड्यूल में कैसे मार्गदर्शन कर सकता हूँ?',
    peanut: '⚠️ मूंगफली एलर्जी हस्तक्षेप चेतावनी:\n\nहमारे सिस्टम ने आपकी प्रोफ़ाइल में एक सख्त "मूंगफली" एलर्जी की पहचान की है। सामान्य नट्स, अपरिष्कृत मूंगफली के रसोइया तेल, या क्रॉस-सुविधा चेतावनियों वाले प्रसंस्कृत खाद्य पदार्थों के सेवन से बचें।\n\nआपकी स्मार्ट रसोई को देखते हुए, "च्युई चोको कुकीज़ (प्रीमियम पैक)" में मूंगफली की चेतावनी दी गई है। सुरक्षित विकल्प के तौर पर सनफ्लावर बटर, कद्दू के बीज, या ताहिनी पेस्ट का उपयोग करें ताकि एलर्जी के बिना उच्च-प्रोटीन प्राप्त किया जा सके।',
    sodium: '💖 उच्च रक्तचाप कार्डियो-संरेखण जांच:\n\nअपने हल्के उच्च रक्तचाप को प्रबंधित करने के लिए, आपको कम सोडियम वाली जीवनशैली का पालन करना चाहिए (अनुशंसित अधिकतम सीमा दैनिक 1,500mg सोडियम है)।\n\nनारियल पानी या बादाम का दूध (दोनों आपकी सूची में मौजूद हैं) जैसे पोटेशियम-समृद्ध पेय सोडियम क्लीयरेंस की प्रक्रिया को तेज करते हैं, जिससे सीधा हृदय स्वास्थ्य बेहतर होता है। भोजन बनाने में साधारण नमक की जगह लहसुन का पाउडर, अजवायन या नींबू का रस इस्तेमाल करें।',
    tylenol: '🚫 दवा-एंजाइम चेतावनी:\n\nआपकी दवा के सक्रिय शेड्यूल में एसिटामिनोफेन (टाइलेनॉल) पंजीकृत है। अंगूर (ग्रेपफ्रूट) के फ्लेवोनोइड्स आंतों के पाचक एंजाइम CYP3A4 को बाधित करते हैं। टाइलेनॉल की खुराक के 4 घंटे के भीतर अंगूर खाने से शरीर में दवा की मात्रा असामान्य हो जाएगी। लीवर पर अत्यधिक भार को रोकने के लिए दवा के समय अंगूर के सोडे या खट्टे कॉकटेल से बचें।',
    water: '💧 तरल संतुलन जांच:\n\nहल्के उच्च रक्तचाप के खिलाफ लगातार पर्याप्त पानी पीना एक शक्तिशाली घरेलू उपाय है। लगातार हाइड्रेशन प्लाज्मा वॉल्यूम को संतुलित रखता है, जिससे रक्त वाहिकाओं का दबाव कम होता है। रोजाना कम से कम 2.4L पानी पीने का लक्ष्य रखें। हर घंटे बिना चीनी वाली ग्रीन सी या इलेक्ट्रोलाइट्स पिएं।',
    default: '🩺 हेल्थगार्ड डिजिटल डायग्नोस्टिक विश्लेषण:\n\nसंपर्क करने के लिए धन्यवाद। आपकी सक्रिय प्रोफाइल (मूंगफली एलर्जी, हल्के उच्च रक्तचाप) के आधार पर, हमारा सुझाव है कि नई खाद्य सामग्रियों में किसी भी प्रकार के एलर्जी जोखिमों की जांच के लिए "स्मार्ट रसोई" की समीक्षा करें।\n\nआप उपभोग से पहले सामग्री का निरीक्षण करने के लिए हमारे कैमरा स्कैनिंग डैशबोर्ड का उपयोग करके मेडिकल पैकेजों को स्कैन कर सकते हैं।',
    quickQuestions: [
      { label: '🥜 मूंगफली एलर्जी जांच', text: 'मुझे मूंगफली एलर्जी और उसकी जगह काम आने वाले सुरक्षित खाद्य पदार्थों के बारे में बताएं।' },
      { label: '💖 दैनिक सोडियम लक्ष्य', text: 'दैनिक सोडियम का सेवन मेरे हल्के उच्च रक्तचाप को कैसे प्रभावित करता है?' },
      { label: '💊 अंगूर और टाइलेनॉल परस्पर क्रिया', text: 'क्या मैं टाइलेनॉल खुराक के समय अंगूर का रस ले सकता हूँ?' },
      { label: '💧 पानी की मात्रा के मानक', text: 'रक्तचाप सूचकांक को ठीक रखने के लिए दैनिक कितने पानी की आवश्यकता होती है?' }
    ],
    templates: [
      { title: 'पेंट्री बायो-संरेखण मूल्यांकन करें', text: 'मेरी पंजीकृत मूंगफली एलर्जी के विरुद्ध पेंट्री की खाद्य सामग्रियों का विश्लेषण करें।' },
      { title: 'दवा खुराक का समय सत्यापित करें', text: 'टाइलेनॉल के सुरक्षित स्वास्थ्य दिशानिर्देश और हानिकारक रिएक्शन की सूची दिखाएं।' },
      { title: 'उच्च रक्तचाप संरेखण रिपोर्ट', text: 'मेरी पेंट्री में मौजूद खाद्य उत्पादों का उपयोग करके कम सोडियम वाली आहार योजना का मसौदा तैयार करें।' }
    ]
  },
  ta: {
    welcome: 'வணக்கம் ஜான். நான் உங்கள் ஹெல்கார்ட் மருத்துவ உதவியாளர், உங்கள் செயலில் உள்ள பயோமெட்ரிக் கோப்பு (32 வயது, 78 கிலோ), பதிவு செய்யப்பட்ட நிலக்கடலை ஒவ்வாமை மற்றும் லேசான உயர் இரத்த அழுத்தவியல் தரவுகளுடன் ஒத்திசைக்கப்பட்டுள்ளேன். உங்களது சமையலறை உணவுப் பொருட்கள் மற்றும் மருந்து அளவுகளை நான் வெற்றிகரமாக பகுப்பாய்வு செய்துள்ளேன். இன்று உங்கள் சுகாதார சீரமைப்பு அல்லது மருந்து அட்டவணையை நான் எவ்வாறு வழிநடத்துவது?',
    peanut: '⚠️ நிலக்கடலை ஒவ்வாமை எச்சரிக்கை:\n\nஎங்கள் அமைப்பு உங்கள் சுயவிவரத்தில் கடுமையான "நிலக்கடலை" ஒவ்வாமையை அடையாளம் கண்டுள்ளது. சாதாரண நட்ஸ், சுத்திகரிக்கப்படாத கடலை எண்ணெய் அல்லது பிற ஒவ்வாமை எச்சரிக்கைகளைக் கொண்ட பதப்படுத்தப்பட்ட உணவுகளை உட்கொள்வதைத் தவிர்க்கவும்.\n\nஉங்கள் ஸ்மார்ட் சமையலறையைப் பார்க்கும்போது, "செவி சோகோ குக்கீஸ் (பிரீமியம் பேக்)" தயாரிப்பில் நிலக்கடலை ஒவ்வாமை எச்சரிக்கை குறிக்கப்பட்டுள்ளது. பாதுகாப்பான மாற்றுகளாக சூரியகாந்தி வெண்ணெய், பூசணி விதைகள் அல்லது எள் பேஸ்ட் ஆகியவற்றை உட்கொள்ளலாம்.',
    sodium: '💖 உயர் இரத்த அழுத்த இதய சீரமைப்பு சோதனை:\n\nஉங்கள் லேசான உயர் இரத்த அழுத்தத்தை నిர்வகிக்க, நீங்கள் குறைந்த சோடியம் உணவு முறையை கடைபிடிக்க வேண்டும் (பரிந்துரைக்கப்பட்ட அதிகபட்ச தினசரி அளவு 1,500mg சோடியம் ஆகும்).\n\nதேங்காய் தண்ணீர் அல்லது பாதாம் பால் போன்ற பொட்டாசியம் நிறைந்த பானங்கள் சோடியத்தை வெளியேற்றி இரத்த அழுத்தத்தைக் குறைக்க உதவுகின்றன. உணவில் உப்பிற்கு பதிலாக பூண்டு தூள், உலர் ஓரிகானோ அல்லது எலுமிச்சை சாற்றை பயன்படுத்தவும்.',
    tylenol: '🚫 மருந்து-என்சைம் எச்சரிக்கை:\n\nஉங்கள் மருந்து அட்டவணையில் அசெட்டமினோஃபென் (டைலெனால்) பதிவு செய்யப்பட்டுள்ளது. திராட்சைப்பழம் (கிரேப்ஃபுரூட்) பிளாவனாய்டுகள் குடல் என்சைம் CYP3A4 இன் செயல்பாட்டைத் தடுக்கின்றன. டைலெனால் உட்கொண்ட 4 மணி நேரத்திற்குள் திராட்சைப்பழத்தை உட்கொள்வது உடலில் மருந்தின் அளவை அசாதாரணமாக அதிகரிக்கும். எனவே மருந்து உட்கொள்ளும் நேரத்திற்கு அருகில் திராட்சைப்பழം பானங்களை தவிர்க்கவும்.',
    water: '💧 திரവ ಸಮತೋಲನ ಪರೀಕ್ಷೆ :\n\nபோதிய நீர் உட்கொள்ளல் லேசான உயர் இரத்த அழுத்தத்திற்கு எதிரான ஒரு சக்திவாய்ந்த இயற்கை மருந்தாகும். தினசரி நீரேற்றம் இரத்த அழுத்தத்தை சீராக வைக்க உதவுகிறது. குறைந்தது 2.4L நீர் குடிப்பதை இலக்காகக் கொள்ளுங்கள். சர்க்கரை சேர்க்காத கிரீன் டீ அல்லது எலக்ட்ரோலைட் சமநிலையை பின்பற்றவும்.',
    default: '🩺 ஹெல்கார்ட் டிஜிட்டல் கண்டறியும் பகுப்பாய்வு:\n\nதொடர்பு கொண்டதற்கு நன்றி. உங்கள் சுயவிவரங்களின்படி (நிலக்கடலை ஒவ்வாமை, லேசான உயர் இரத்த அழுத்தம்), புதிதாக சேர்க்கப்பட்ட உணவுகளில் ஏதேனும் ஒவ்வாமை ஆபத்து உள்ளதா என்பதைச் சரிபார்க்க "ஸ்மார்ட் சமையலறையை" மதிப்பாய்வு செய்ய பரிந்துரைக்கிறேன்.\n\nஉட்கொள்வதற்கு முன் பொருட்கள் மற்றும் ஒவ்வாமைகளை சரிபார்க்க எங்களது கேமரா ஸ்கேனிங் வசதியைப் பயன்படுத்தி மருத்துவ பாக்கெட்டுகளை ஸ்கேன் செய்யலாம்.',
    quickQuestions: [
      { label: '🥜 நிலக்கடலை ஒவ்வாமை சோதனை', text: 'நிலக்கடலை ஒவ்வாமை பற்றியும் எனது பான்ட்ரியில் உள்ள பாதுகாப்பான உணவு மாற்றுகள் பற்றியும் கூறுங்கள்.' },
      { label: '💖 தினசரி சோடியம் இலக்குகள்', text: 'தினசரி சோடியம் உட்கொள்வது எனது லேசான உயர் இரத்த அழுத்தத்தை எவ்வாறு பாதிக்கிறது?' },
      { label: '💊 டைலெனால் பக்க விளைவுகள்', text: 'எனது டைலெனால் மருந்து நேரத்திற்கு அருகில் நான் சாத்துக்குடி அல்லது திராட்சை சாறு குடிக்கலாமா?' },
      { label: '💧 நீர் குடிப்பின் அளவுகள்', text: 'இரத்த அழுத்த குறியீடுகளை சீரமைக்க தினசரி எவ்வளவு தண்ணீர் குடிக்க வேண்டும்?' }
    ],
    templates: [
      { title: 'உணவு ஒவ்வாமை ஆய்வு', text: 'எனது பான்ட்ரியில் சேமிக்கப்பட்டுள்ள உணவுகளை பகுப்பாய்வு செய்து நிலக்கடலை ஒவ்வாமை எச்சரிக்கைகளை சரிபார்க்கவும்.' },
      { title: 'மருந்து நேர சரிபார்ப்பு', text: 'அசெட்டமினோஃபென் மருந்துக்கான பாதுகாப்பு மற்றும் ஆபத்தான எதிர்வினைகளை காண்க.' },
      { title: 'உயர் இரத்த அழுத்த உணவு சீரமைப்பு', text: 'எனது சமையலறைப் பொருட்களைக் கொண்டு குறைந்த சோடியம் உணவு மெனுவைத் தயாரிக்கவும்.' }
    ]
  },
  es: {
    welcome: 'Saludos John. Soy su Asistente Clínico HealthGuard, sincronizado con su archivo de biométricos (32 años, 78 kg), alergias registradas al cacahuete e hipertensión leve. Analicé sus alimentos en la despensa y dosis de fármacos. ¿Cómo puedo guiar hoy sus alineaciones de salud sistémica?',
    peanut: '⚠️ ALERTA DE ALERGIA AL CACAHUETE:\n\nNuestro sistema identificó alergia estricta a los cacahuetes. Evite frutos secos tradicionales, aceites de cacahuete no refinados o alimentos procesados con avisos de alérgenos.\n\nLas "Chewy Choco Cookies (Premium Pack)" de su despensa tienen una advertencia destacada. Utilice mantequilla de girasol, semillas de calabaza o tahini.',
    sodium: '💖 EXAMEN CARDIACO PARA LA HIPERTENSIÓN:\n\nPara controlar su hipertensión leve, mantenga un estilo de vida bajo en sodio (menos de 1,500mg diarios recomendado).\n\nEl agua de coco y la leche de almendras facilitan la depuración de sodio celular, bajando la carga capilar. En la comida, use polvo de ajo u orégano en vez de sal.',
    tylenol: '🚫 ADVERTENCIA ANTICÍTRICOS CON ACETAMINOFÉN:\n\nTiene Acetaminofén (Tylenol) activo en su registro del horario médico. Los flavonoides del pomelo inhiben la enzima CYP3A4. El jugo de pomelo 4 horas antes o después del fármaco causará niveles letales de fármaco en el hígado. Evite el pomelo.',
    water: '💧 CONTROL DE HIDRATACIÓN DIARIA:\n\nBeber agua constantemente es un potente agente no farmacológico contra la hipertensión leve. Diluye el volumen del plasma para bajar la presión. Tome como mínimo 2.4 litros de agua por día.',
    default: '🩺 ANÁLISIS CLÍNICO HEALTHGUARD AI:\n\nGracias por comunicarse con el sistema clínico. Revise la Despensa Inteligente para comprobar si hay alimentos recién incorporados que contengan alérgenos.',
    quickQuestions: [
      { label: '🥜 Alergia a Cacahuetes', text: 'Háblame de los alérgenos del cacahuete y qué alternativas seguras tengo.' },
      { label: '💖 Metas de Sodio diario', text: '¿Cómo afecta el sodio diario a mi hipertensión leve?' },
      { label: '💊 Interacción Tylenol y Pomelo', text: '¿Puedo consumir jugo de pomelo cerca de mi toma de Tylenol?' },
      { label: '💧 Nivel de Hidratación', text: '¿Cuánta agua diaria necesito para alinear mi presión arterial?' }
    ],
    templates: [
      { title: 'Evaluar Bioalineación de Alimentos', text: 'Analiza mis alimentos e ingredientes de despensa contra mi alergia al cacahuete.' },
      { title: 'Verificar Horarios de Fármacos', text: 'Muestra las contraindicaciones e interacciones de Tylenol.' },
      { title: 'Menú de Hipertensión', text: 'Diseña un menú de desayuno bajo en sodio usando mis ingredientes reales.' }
    ]
  },
  fr: {
    welcome: 'Bonjour John. Je suis votre assistant clinique HealthGuard, synchronisé avec votre profil biométrique (32 ans, 78 kg), votre stricte allergie aux arachides et votre hypertension. J’ai bien audité vos stocks alimentaires de cuisine et prescriptions. Comment puis-je vous aider aujourd’hui ?',
    peanut: '⚠️ ALERTE INTERVENTION ALLERGIE ARACHIDES :\n\nAllergie stricte détectée. Évitez arachides, huiles d’arachide brutes, noix ordinaires et biscuits avec traces suspectes.\n\nLe produit "Chewy Choco Cookies (Premium Pack)" dispose d’un signalement de risque. Optez pour le beurre de tournesol, graines de citrouille ou émulsions de sésame.',
    sodium: '💖 HYPERTENSION CARDIO-CONTRÔLE :\n\nPour limiter l’hypertension, l’apport journalier recommandé en sodium est de moins de 1,500mg par jour.\n\nL’eau de coco ou le lait d’amande favorisent l’élimination cellulaire du sodium. Assaisonnez vos plats avec de l’origan ou poudre d’ail plutôt que du sel.',
    tylenol: '🚫 ACTION ENZYMATIQUE DU PAMPLEMOUSSE :\n\nVous consommez de l’Acétaminophen (Tylenol). Le pamplemousse bloque le fonctionnement des enzymes CYP3A4 digestives. Sa consommation dans les 4 heures précédant le médicament augmentera sa concentration sérique. Évitez les agrumes.',
    water: '💧 BESOIN HYDRIQUE QUOTIDIEN :\n\nConsommer suffisamment de l’eau fluide permet d’abaisser le volume plasmatique moyen et soulager la pression cardiaque. Consommez un minimum de 2.4L de liquides par jour.',
    default: '🩺 BILAN DIGITAL DE VIGILANCE HEALTHGUARD AI :\n\nMerci de votre message. Veuillez évaluer régulièrement vos compléments alimentaires ou ingrédients de cuisine via le menu Smart Pantry pour écarter tout allergène.',
    quickQuestions: [
      { label: '🥜 Allergies Arachides', text: 'Parlez-moi des arachides et des alternatives sûres dans mon garde-manger.' },
      { label: '💖 Objectifs de Sodium', text: 'Quel est l’impact du sodium quotidien sur mon hypertension légère ?' },
      { label: '💊 Interactions Tylenol', text: 'Puis-je boire du jus de pamplemousse près de mon traitement au Tylenol ?' },
      { label: '💧 Repère d’Eau journalier', text: 'Combien d’eau dois-je boire pour réguler ma tension artérielle ?' }
    ],
    templates: [
      { title: 'Compatibilité Garde-Manger', text: 'Analyser les ingrédients de la cuisine pour vérifier l’absence d’arachides.' },
      { title: 'Contre-indications Médicaments', text: 'Consulter la notice d’utilisation et risques du Tylenol.' },
      { title: 'Programme Hypertension', text: 'Générer un petit déjeuner sans sel d’après mon stock pantry.' }
    ]
  },
  bn: {
    welcome: 'স্বাগতম জন। আমি আপনার হেলথগার্ড ক্লিনিকাল সহকারী। আপনার বায়োমেট্রিক প্রোফাইল (৩২ বছর, ৭৮ কেজি), চিনাবাদাম অ্যালার্জি এবং হালকা উচ্চ রক্তচাপ ট্র্যাকের সাথে আমি সংযুক্ত রয়েছি। আজ আপনার স্বাস্থ্য পরিকল্পনা বা ওষুধের রুটিনে কীভাবে সাহায্য করতে পারি?',
    peanut: '⚠️ চিনাবাদাম অ্যালার্জি সতর্কতা: আপনার প্রোফাইলে চিনাবাদাম অ্যালার্জি সক্রিয় রয়েছে। চিনাবাদামযুক্ত প্রক্রিয়াজাত খাদ্য পরিহার করুন। "Chewy Choco Cookies" এ সতর্কবার্তা রয়েছে। এর বিকল্প হিসেবে সূর্যমুখীর মাখন বা কুমড়োর বীজ ব্যবহার করুন।',
    sodium: '💖 কম সোডিয়াম কার্ডিও চেক: আপনার উচ্চ রক্তচাপ নিয়ন্ত্রণে রাখতে দৈনিক ১৫০০ মিলিগ্রামের কম সোডিয়াম গ্রহণ করা উচিত। নারকেলের পানি বা বাদামের দুধ পটাশিয়াম সমৃদ্ধ হওয়ায় রক্তচাপ কমাতে সাহায্য করে। রান্নায় লবণের বদলে রসুন গুঁড়ো বা লেবুর রস ব্যবহার করুন।',
    tylenol: '🚫 ওষুধ সতর্কতা: আপনার প্রেসক্রিপশনে টাইলেনল রয়েছে। ওষুধের সাথে জাম্বুরা (Grapefruit) খাবেন না, এতে ওষুধের বিষক্রিয়া হতে পারে। টাইলেনল খাওয়ার ৪ ঘণ্টার মধ্যে টক ফল বর্জন করুন।',
    water: '💧 পানি পান মাত্রা: উচ্চ রক্তচাপ কমাতে দৈনিক পর্যাপ্ত পানি অত্যন্ত কার্যকর। দৈনিক কমপক্ষে ২.৪ লিটার পানি পানের লক্ষ্য পূরণ করুন। গ্রিন টি বা ইলেকট্রোলাইট পান করুন।',
    default: '🩺 হেলথগার্ড এআই বিশ্লেষণ: ধন্যবাদ। আপনার প্রোফাইলের ওপর ভিত্তি করে প্যান্ট্রি খাবার সতর্কতার সাথে পর্যালোচনা করার পরামর্শ দেওয়া হচ্ছে। অনুগ্রহ করে আমাদের ক্যামেরা স্ক্যানারে লেবেল স্ক্যান করে পরীক্ষা করুন।',
    quickQuestions: [
      { label: '🥜 চিনাবাদাম অ্যালার্জি পরীক্ষা', text: 'চিনাবাদাম অ্যালার্জি এবং এর নিরাপদ বিকল্প সম্পর্কে আমাকে বলুন।' },
      { label: '💖 দৈনিক সোডিয়াম লক্ষ্য', text: 'সোডিয়াম গ্রহণ কীভাবে আমার উচ্চ রক্তচাপকে প্রভাবিত করে?' },
      { label: '💊 টাইলেনল ও জাম্বুরার বিক্রিয়া', text: 'আমি কি টাইলেনল খাওয়ার কাছাকাছি সময়ে জাম্বুরার রস খেতে পারি?' },
      { label: '💧 পানির মাত্রা নির্ধারণ', text: 'রক্তচাপ নিয়ন্ত্রণে রাখতে দৈনিক কতটুকু পানি পান করা দরকার?' }
    ],
    templates: [
      { title: 'প্যান্ট্রি অ্যালার্জি পরীক্ষা', text: 'আমার প্যান্ট্রির খাবারগুলোতে চিনাবাদামের উপস্থিতির ওপর অডিট করুন।' },
      { title: 'ওষুধের প্রতিক্রিয়া যাচাই', text: 'টাইলেনল খাওয়ার সতর্কতা এবং নিরাপদ উপায়গুলি তালিকাভুক্ত করুন।' },
      { title: 'সোডিয়াম মুক্ত খাদ্য পরিকল্পনা', text: 'আমার প্যান্ট্রির উপাদান থেকে কম সোডিয়ামযুক্ত সকালের নাস্তার মেনি তৈরি করুন।' }
    ]
  },
  te: {
    welcome: 'నమస్తే జాన్. నేను మీ హెల్త్‌గార్డ్ క్ლიనికల్ అసిస్టెంట్‌ని. మీ బయోమెట్రిక్ ప్రೊఫైల్ (32 సంవత్సరాలు, 78 కిలోలు), వేరుశెనగ అలర్జీ మరియు రక్తపోటు వివరాలను విశ్లేషించాను. ఈరోజు మీ ఆరోగ్య రక్షణకు ఏ విధంగా సహాయపడగలను?',
    peanut: '⚠️ అలర్జీ హెచ్చరిక: మీ ప్రొఫైల్‌లో వేరుశెనగ అలర్జీ ఉంది. ప్యాక్ చేసిన స్నాక్స్‌ను నివారించండి. "Chewy Choco Cookies" లో వేరుశెనగలు ఉన్నాయి. వాటి స్థానంలో గుమ్మడి గింజలు తీసుకోండి.',
    sodium: '💖 తక్కువ సోడియం తనిఖీ: మీ రక్తపోటు నియంత్రణకు ప్రతిరోజూ 1,500mg కన్నా తక్కువ సోడియం తీసుకోవాలి. కొబ్బరి నీరు, బాదం పాలు సోడియంను త్వరగా తగ్గించి గుండెకు మేలు చేస్తాయి.',
    tylenol: '🚫 మందుల హెచ్చరిక: మీరు టైలెనాల్ వాడుతున్నారు. గ్రేప్‌ఫ్రూట్ పండ్లు టైలెనాల్ మందుల तीव्रताను పెంచుతాయి. మందు వేసుకునే 4 గంటల వ్యత్యాసంలో సిట్రస్ పండ్లు తీసుకోకూడదు.',
    water: '💧 నీటి శాతం సమతుల్యత: రక్తపోటు తగ్గడానికి నీటి శాతాన్ని సరిగ్గా ఉంచడం ముఖ్యం. రోజూ కనీసం 2.4L నీరు తాగడం అలವಾటు చేసుకోండి.',
    default: '🩺 హెల్త్‌గార్డ్ డిజిటల్ విశ్లేషణ: సంప్రదించినందుకు ధನ್ಯవాదాలు. కొత్తగా కొన్న ఆహార పదార్థాలలో మీ అలర్జీలకు సంబంధించిన పదార్థాలు ఉన్నాయో లేదో తెలుసుకోవడానికి మా స్కానర్ వాడండి.',
    quickQuestions: [
      { label: '🥜 వేరుశెనగ అలర్జీ తనిఖీ', text: 'వేరుశెనగ అలర్జీ మరియు సురక్షితమైన ప్రత్యామ్നాయాల గురించి చెప్పండి.' },
      { label: '💖 రోజువారీ సోడియం లక్ష్యాలు', text: 'రోజువారీ సోడియం నా రక్తపోటును ఎలా ప్రభాویتం చేస్తుంది?' },
      { label: '💊 టైలెనాల్ మందుల జాగ్రత్తలు', text: 'టైలెనాల్ వేసుకునే సమయంలో గ్రేప్‌ఫ్రూట్ జ్యూస్ తాగవచ్చా?' },
      { label: '💧 నీటి శాతం మార్गదర్శకాలు', text: 'యాక్టివ్ రక్తపోటును అదుపులో ఉంచడానికి ఎంత నీరు తాగాలి?' }
    ],
    templates: [
      { title: 'ప్యాంట్రీ అలర్జీ విశ్లేషణ', text: 'నా ప్యాంట్రీ వస్తువులలో వేరుశెనగ అలర్జీ వచ్చే వస్తువులు ఉన్నాయో లేదో పరీక్షించండి.' },
      { title: 'ఔషధ నిబంధనల తనిఖీ', text: 'టైలెనాల్ మందుల యొక్క దుష్ప్రభావాలు మరియు సుರక్షిత వాడకాన్ని చూపండి.' },
      { title: 'రక్తపోటు తగిన ఆహారం', text: 'నా ప్యాంట్రీ సరుకులతో తక్కువ సోడియం ఉదయపు టిఫిన్ ప్లాన్ చేయండి.' }
    ]
  },
  mr: {
    welcome: 'नमस्कार जॉन. मी आपला हेल्थगार्ड क्लिनिकल असिस्टंट आहे. आपल्या आरोग्याची आणि औषधांची माहिती माझ्याकडे उपलब्ध आहे. मी आज आपल्याला कसा मदत करू शकतो?',
    peanut: '⚠️ शेंगदाणा ॲलर्जी अलर्ट: तुमच्या प्रोफाइलमध्ये शेंगदाणा ॲलर्जी नोंदवली आहे. चेवी चोको कुकीज खाणे टाळा. त्याऐवजी सूर्यफुलाच्या बिया वापरणे सुरक्षित आहे.',
    sodium: '💖 हायपरटेन्शन कार्डिओ चेक: रक्तदाब नियंत्रणासाठी दिवसभरात १५००mg पेक्षा कमी सोडियमचे सेवन करा. आहारात नेहमीच्या मिठाऐवजी लसूण पावडर किंवा लिंबू रस वापरावा.',
    tylenol: '🚫 औषध संवाद चेतावणी: आपण टायलेनॉल घेत आहात. औषधांच्या ४ तास आधी व नंतर ग्रेपफ्रूट किंवा संत्र्याचा रस घेणे टाळले पाहिजे जेणेकरून यकृतावर भार पडणार नाही.',
    water: '💧 पाण्याचे प्रमाण आणि हायड्रेशन: नियमित हायड्रेशनमुळे रक्तवाहिन्यांचा दाब कमी होतो. दररोज किमान २.४ लीटर पाणी पिण्याचे उद्दिष्ट ठेवा.',
    default: '🩺 हेल्थगार्ड डिजिटल निदान: संपर्कासाठी धन्यवाद. आपल्या आहारात ॲलर्जी असलेल्या पदार्थांचा समावेश नाही ना, याची खात्री करण्यासाठी पँट्री तपासा.',
    quickQuestions: [
      { label: '🥜 शेंगदाणा ॲलर्जी माहिती', text: 'शेंगदाणा ॲलर्जी आणि त्यासाठीच्या सुरक्षित पर्यायांबद्दल सांगा.' },
      { label: '💖 सोडियम मर्यादा', text: 'रोजच्या सोडियम सेवनाचा माझ्या रक्तदाबावर काय परिणाम होतो?' },
      { label: '💊 औषध संवाद चेक', text: 'टायलेनॉल घेताना मी ग्रेपफ्रूट ज्यूस पिऊ शकतो का?' },
      { label: '💧 पाणी पिण्याची पातळी', text: 'माझा रक्तदाब संतुलित ठेवण्यासाठी मला रोज किती पाणी पिणे आवश्यक आहे?' }
    ],
    templates: [
      { title: 'पँट्री ॲलर्जी असेसमेंट', text: 'माझ्या पँट्री मधील खाद्यपदार्थ शेंगदाणा ॲलर्जीसाठी तपासा.' },
      { title: 'औषध वेळापत्रक खात्री', text: 'टायलेनॉलच्या सुरक्षित आरोग्य मार्गदर्शक तत्त्वांचे पुनरावलोकन करा.' },
      { title: 'कमी सोडियम आहार योजना', text: 'माझ्या पँट्रीतील पदार्थांच्या आधारे सोडियम मुक्त नास्ता प्लॅन तयार करा.' }
    ]
  },
  gu: {
    welcome: 'નમસ્તે જ્હોન. હું તમારો હેલ્થગાર્ડ ક્લિનિકલ આસિસ્ટન્ટ છું. તમારી એલર્જી અને બ્લડ પ્રેશરને આધારે હું તમને યોગ્ય સલાહ આપીશ. આજે હું તમને કેવી રીતે મદદ કરું?',
    peanut: '⚠️ મગફળી એલર્જી એલર્ટ: પ્રોફાઇલમાં પિનાટ એલર્જી નોંધાયેલી છે. બજારના કૂકીઝ ટાળો. બદલે સૂર્યમુખીના બીજ કે તલ વાપરો.',
    sodium: '💖 ભોજનમાં સોડિયમ નિયંત્રણ: બ્લડ પ્રેશર નિયંત્રણ માટે દૈનિક સોડિયમનું પ્રમાણ ૧૫૦૦mg થી ઓછું હોવું હિતાવહ છે. પ્રવાહી વધારે લેવું.',
    tylenol: '🚫 દવા ચેતવણી: તમે ટાયલેનોલ લઈ રહ્યા છો. દવાની અસર સાથે ખાટા ફળો ખાસ કરીને ગ્રેપફ્રૂટ ન ખાવું જોઈએ, આ લીવર પર નુકસાન પહોંચાડી શકે છે.',
    water: '💧 રોજિંદું પાણીનું પ્રમાણ: બ્લડ પ્રેશર કંટ્રોલમાં નિયમિત પુષ્કળ પાણી પીવું ફળદાયી છે. દિવસમાં ઓછામાં ઓછું ૨.૪ લીટર પાણી લો.',
    default: '🩺 હેલ્થગાર્ડ ડીજીટલ એનાલિસિસ: નમસ્તે. નુકસાનકારક તત્વો તપાસવા માટે કૃપા કરીને આપણી એપ્લીકેશન દ્વારા લેબલ સ્કેન કરો.',
    quickQuestions: [
      { label: '🥜 મગફળી એલર્જી તપાસ', text: 'મગફળીની એલર્જી અને તેનાથી બચવા માટે સુરક્ષિત ઓપ્શન્સ કહો.' },
      { label: '💖 દૈનિક સોડિયમ લક્ષ્ય', text: 'સોડિયમ મારા હાઈ બ્લડ પ્રેશરને કેવી રીતે અફેક્ટ કરે છે?' },
      { label: '💊 ટાયલેનોલ સાથે ખાટાં ફળો', text: 'શું ટાયલેનોલ લીધા પછી હું ગ્રેપફ્રૂટ જ્યુસ પી શકું છું?' },
      { label: '💧 વોટર ઇન્ટેક લેવલ', text: 'બ્લડ પ્રેશર સામાન્ય રાખવા રોજ કેટલું પાણી પીવું જોઈએ?' }
    ],
    templates: [
      { title: 'ચેક એલર્જન પૅન્ટ્રી', text: 'મારી પૅન્ટ્રીની આઈટમ્સમાં એલર્જી ઉત્પન્ન કરે તેવી કોઈ વસ્તુઓ છે?' },
      { title: 'દવાના ઉપયોગની તપાસ', text: 'ટાયલેનોલની સાથે કઈ વસ્તુઓ લેવી નુકસานકારક છે તે કહો.' },
      { title: 'હેલ્ધી ગ્રીન ડાયેટ મેનૂ', text: 'મારી રસોડાના સામાનથી લો-સોડિયમ વાળા હેલ્ધી નાસ્તાનું મેનૂ બનાવો.' }
    ]
  },
  kn: {
    welcome: 'ನಮಸ್ತೆ ಜಾನ್. ನಾನು ನಿಮ್ಮ ಆರೋಗ್ಯ ರಕ್ಷಕ ಹೆಲ್ತ್ ಗಾರ್ಡ್ ಐಐ ಅಸিস্টೆಂಟ್. ನಾನು ನಿಮ್ಮ ಅಲರ್ಜಿಗಳು ಮತ್ತು ಔಷಧೋಪಚಾರಗಳನ್ನು ಆಧರಿಸಿ ಸೂಕ್ತ ಆರೋಗ್ಯ ಸಲಹೆಗಳನ್ನು ನೀಡಬಲ್ಲೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಯಾವ ಸಹಾಯ ಮಾಡಲಿ?',
    peanut: '⚠️ ಶೇಂಗಾ ಅಲರ್ಜಿ ಎಚ್ಚರಿಕೆ: ನಿಮ್ಮ ಪ್ರೊಫൈಲ್ ಪ್ರಕಾರ ಶೇಂಗಾ ಅಲರ್ಜಿ ದೃಢಪಟ್ಟಿದೆ, ಆದ್ದರಿಂದ ಕುಕೀಗಳನ್ನು ತಿನ್ನಬೇಡಿ. ಪ್ರೋಟೀನ್‌ಗಾಗಿ ಕುಂಬಳಕಾಯಿ ಬೀಜಗಳನ್ನು ಸೇವಿಸಿ.',
    sodium: '💖 ರಕ್ತದೊತ್ತಡ ನಿಯಂತ್ರಣ: ಲಘು ರಕ್ತದೊತ್ತಡ ಗುಣಪಡಿಸಲು ಉಪ್ಪಿನ ಸೇವನೆ ದಿನಕ್ಕೆ 1,500mg ಗಿಂತ ಕಡಿಮೆ ಇರುವಂತೆ ನೋಡಿಕೊಳ್ಳಿ. ಕೊಬ್ಬರಿ ನೀರನ್ನು ಕುಡಿಯಿರಿ.',
    tylenol: '🚫 ಔಷಧ ಮುನ್ನೆಚ್ಚриಕೆ: ನೀವು ಟೈಲೆನಾಲ್ ತೆಗೆದುಕೊಳ್ಳುತ್ತಿದ್ದರೆ ಸಿಟ್ರಸ್ ಅಥವಾ ದ್ರಾಕ್ಷಿ ಹಣ್ಣು ರस ಅಥವಾ ಹಣ್ಣು ತಿನ್ನುವುದನ್ನು ತಪ್ಪಿಸಿ.',
    water: '💧 ನಿಯಮಿತ ಜಲಸేవನೆ: ರಕ್ತದೊತ್ತಡ ನಿವಾರಣೆಗೆ ದಿನನಿತ್ಯ ನೀರು ಅತ್ಯಗತ್ಯ. ನಿತ್ಯವೂ ಕನಿಷ್ಠ 2.4L ರಷ್ಟು ಶುದ್ಧ ನೀರನ್ನು ಕುಡಿಯಿರಿ.',
    default: '🩺 ಹೆಲ್ತ್ ಗಾರ್ಡ್ ಡಿಜಿಟಲ್ ಪರೀಕ್ಷೆ: ವಿಚಾರಿಸಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು. ನೀವು ಆಹಾರಗಳನ್ನು ಬಳಸುವ ಮುன்ன ನಮ್ಮ ಕ್ಯಾಮರಾ ಮೂಲಕ ಪದার্থಗಳ ಲೇಬಲ್ ಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ಎಚ್ಚರವಹಿಸಿ.',
    quickQuestions: [
      { label: '🥜 ಶೇಂಗಾ ಅಲರ್ಜಿ ಪರೀಕ್ಷೆ', text: 'ಶೇಂಗಾ ಅಲರ್ಜಿ ಮತ್ತು ಅದಕ್ಕೆ ಪರ್ಯಾಯವಾದ ಪೌಷ್ಟಿಕ ಆಹಾರಗಳ ಬಗ್ಗೆ ತಿಳಿಸಿ.' },
      { label: '💖 ಕನಿಷ್ಠ ಉಪ್ಪಿನ ದಿನಚರಿ', text: 'ಸೋಡಿಯಂ ಪ್ರಮಾಣವು ನನ್ನ ರಕ್ತದೊತ್ತಡದ ಮೇಲೆ ಹೇಗೆ ಪ್ರಭಾವ ಬೀರುತ್ತದೆ?' },
      { label: '💊 ಔಷಧ ಮತ್ತು ದ్రాಕ್ಷಿ ಕ್ರಿಯೆ', text: 'ಟೈಲೆನಾಲ್ ಮಾತ್ರೆಯ ಜೊತೆ ದ్రాಕ್ಷಿ ರಸ ಕುಡಿಯುವುದು ಸರಿಯೇ?' },
      { label: '💧 ಜಲಸేవನೆ ನಿಯಮಗಳು', text: 'ಲಘು ರಕ್ತದೊತ್ತಡ ಕಡಿಮೆ ಮಾಡಲು ನಿತ್ಯವೂ ಎಷ್ಟು ಪ್ರಮಾಣದಲ್ಲಿ ನೀರನ್ನು ಬಳಸಬೇಕು?' }
    ],
    templates: [
      { title: 'ಶೇಂಗಾ ಅಲರ್ಜಿ ಪರಿಶೀಲನೆ', text: 'ನನ್ನ ಶೇಖರಣೆಯಲ್ಲಿರುವ ಆಹಾರ ಪದার্থಗಳಲ್ಲಿ ಶೇಂಗಾ ಅಲರ್ಜಿ ಕಾರಕಗಳು ಇವەیە ಎಂದು ಪತ್ತೆ ಮಾಡಿ.' },
      { title: 'ಔಷಧ ತೀವ್ರತೆ ಗಮನಿಸಿ', text: 'ಟೈಲೆನಾಲ್ ಮಾತ್ರೆಯ ದುಷ್ಪರಿಣಾಮ ಹಾಗೂ ಸುರક્ષಿತ ಬಳಕೆಯ ನಿಯಮಗಳನ್ನು ತೋರಿಸಿ.' },
      { title: 'ಲಘು ಉಪ್ಪಿನ ಆಹಾರಪಟ್ಟಿ', text: 'ನನ್ನ ಆಹಾರ ಪದার্থಗಳಿಂದ ಕಡಿಮೆ ಸೋಡಿಯಂ ಇರುವ ಬೆಳಗಿನ ಉಪಹಾರದ ಮೆನು ಸಿದ್ಧಪಡಿಸಿ.' }
    ]
  },
  ml: {
    welcome: 'Greetings John. ഞാൻ നിങ്ങളുടെ ഹെൽത്ത് ഗാർഡ് ക്ലിനിക്കൽ അസിസ്റ്റന്റാണ്. നിങ്ങളുടെ അലർജികളും ബിപി വിവരങ്ങളും നോക്കി സഹായം നൽകാം. ഇന്ന് ഞാൻ നിങ്ങൾക്ക് എങ്ങനെയാണ് സഹായിേണ്ടത്?',
    peanut: '⚠️ നിലക്കടല അലർജി: നിലക്കടല അലർജിയുള്ളതിനാൽ ബിസ്ക്കറ്റുകളോ മധുരപലഹാരങ്ങളോ സൂക്ഷിക്കുക. പകരമായി സൂര്യകാന്തി വിത്തുകൾ കഴിക്കാം.',
    sodium: '💖 രക്തസമ്മർദ്ദ നിയന്ത്രണം: ലഘുവായ ഹൈപ്പർടെൻഷൻ കുറയ്ക്കാൻ പ്രതിദിനം 1,500mg താഴെ മാത്രം സോഡിയം ഉപയോഗിക്കുക.',
    tylenol: '🚫 മരുന്ന് അലർജി ജാഗ്രത: ടൈലനോൾ കഴിക്കുമ്പോൾ മുന്തിരിങ്ങാ ജ്യൂസ് കുടിക്കരുത്. സിട്രസ് വിഭാഗത്തിലുള്ള പഴങ്ങൾ ടൈലനോളിന്റെ പ്രവർത്തനം ദോഷമായി ബാധിക്കും.',
    water: '💧 ശുദ്ധജലം ഉപയോഗം: രക്തസമ്മർദ്ദം സാധാരണ നിലയിലാക്കാൻ വെള്ളം കുടിക്കുന്നത് പ്രധാനമാണ്. ദിവസവും 2.4L വെള്ളമെങ്കിലും കുടിക്കുക.',
    default: '🩺 ഹെൽത്ത് ഗാർഡ് എഐ പരിശോധന: നന്ദി. നിങ്ങളുടെ അലർജികൾ ഒഴിവാക്കാൻ സാധനങ്ങൾ വാങ്ങുമ്പോൾ ഞങ്ങളുടെ ക്യാമറ സ്കാനർ ഉപയോഗിച്ച് വാങ്ങി പരിശോധിക്കുക.',
    quickQuestions: [
      { label: '🥜 നിലക്കടല അലർജി വിവരങ്ങൾ', text: 'നിലക്കടല അലർജിയെക്കുറിച്ചും അതിനായുള്ള സുരക്ഷിതമായ മറ്റ് ഭക്ഷണങ്ങളെയും പറ്റി പറയുക.' },
      { label: '💖 പ്രതിദിന സോഡിയം അളവ്', text: 'ഉപ്പിന്റെ അമിത ഉപയോഗം എന്റെ രക്തസമ്മർദ്ദത്തെ എങ്ങനെ ബാധിക്കും?' },
      { label: '💊 ടൈലനോൾ പ്രതികൂല ഫലം', text: 'ടൈലനോൾ ഗുളിക കഴിക്കുന്നതിനൊപ്പം മുന്തിരി ജ്യൂസ് കഴിക്കാമോ?' },
      { label: '💧 ജലാംശ നിയന്ത്രണം', text: 'രക്തസമ്മർദ്ദം ക്രമീകരിക്കാൻ ഒരു ദിവസം എത്ര ലിറ്റർ വെള്ളം കുടിക്കണം?' }
    ],
    templates: [
      { title: 'അലർജി ഫ്രീ പാൻട്രി പരിശോധന', text: 'എന്റെ പാൻട്രിയിൽ ഇരിക്കുന്ന സാധനങ്ങൾ അലർജി സാധ്യതയുള്ളതാണോ എന്ന് പരിശോധിക്കുക.' },
      { title: 'മരുന്നുകളുടെ സുരക്ഷാ റിവ്യൂ', text: 'ടൈലനോൾ ഉപയോഗ മാർഗനിർദേശങ്ങൾ വിവരിക്കുക.' },
      { title: 'ലോ-സോഡിയം ഭക്ഷണക്രമം', text: 'എന്റെ അടുക്കളയിലെ വിഭവങ്ങൾ വച്ച് സോഡിയം കുറഞ്ഞ നല്ലൊരു പ്രഭാതഭക്ഷണം തയാറാക്കുക.' }
    ]
  },
  pa: {
    welcome: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੌਨ। ਮੈਂ ਤੁਹਾਡਾ ਹੈਲਥਗਾਰਡ ਕਲੀਨਿਕਲ ਅਸਿਸਟੈਂਟ ਹਾਂ। ਤੁਹਾਡੀ ਐਲਰਜੀ ਅਤੇ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਦੇ ਮੁਤਾਬਕ ਮੈਂ ਤੁਹਾਨੂੰ ਸਹੀ ਸਲਾਹ ਦੇਵਾਂਗਾ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
    peanut: '⚠️ ਮੂੰਗਫਲੀ ਐਲਰਜੀ ਚੇਤਾਵਨੀ: ਤੁਹਾਡੇ ਪ੍ਰੋਫਾਈਲ ਵਿੱਚ ਮੂੰਗਫਲੀ ਤੋਂ ਐਲਰਜੀ ਹੈ। ਕੂਕੀਜ਼ ਤੋਂ ਪਰਹੇਜ਼ ਰੱਖੋ ਅਤੇ ਸੂਰਜਮੁਖੀ ਦੇ ਬੀਜਾਂ ਦਾ ਸੇਵਨ ਕਰੋ।',
    sodium: '💖 ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਅਤੇ ਲੂਣ ਮਾਤਰਾ: ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਨੂੰ ਸਹੀ ਰੱਖਣ ਲਈ ਰੋਜ਼ਾਨਾ ਲੂਣ ਦੀ ਮਾਤਰਾ 1500mg ਤੋਂ ਘੱਟ ਰੱਖੋ। ਨਾਰੀਅਲ ਪਾਣੀ ਲਾਹੇਵੰਦ ਹੈ।',
    tylenol: '🚫 ਦਵਾਈ ਪ੍ਰਤੀਕਿਰਿਆ ਚੇਤਾਵਨੀ: ਤੁਸੀਂ ਟਾਈਲੇਨੌਲ ਲੈ ਰਹੇ ਹੋ। ਖੱਟੇ ਫਲ ਅਤੇ ਗ੍ਰੇਪਫ੍ਰੂਟ ਜੂਸ ਦਵਾਈ ਦੇ ਅਸਰ ਨੂੰ ਖਰਾਬ ਕਰ ਸਕਦੇ ਹਨ।',
    water: '💧 ਪਾਣੀ ਪੀਣ ਦੀ ਸਲਾਹ: ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਕੰਟਰੋਲ ਕਰਨ ਲਈ ਪੂਰਾ ਪਾਣੀ ਪੀਣਾ ਬਹੁਤ ਜ਼ਰੂਰੀ ਹੈ। ਰੋਜ਼ਾਨਾ ਘੱਟੋ-ਘੱਟ 2.4L ਪਾਣੀ ਪੀਓ।',
    default: '🩺 ਹੈਲਥਗਾਰਡ ਡਿਜੀਟਲ ਸਿਸਟਮ: ਰਾਬਤਾ ਕਰਨ ਲਈ ਧੰਨਵਾਦ। ਕਿਸੇ ਵੀ ਨੁਕਸਾਨਦੇਹ ਚੀਜ਼ ਤੋਂ ਬਚਣ ਲਈ ਸਾਡੇ ਕੈਮਰੇ ਰਾਹੀਂ ਦਵਾਈਆਂ ਜਾਂ ਖਾਣ ਵਾਲੀਆਂ ਚੀਜ਼ਾਂ ਦੇ ਲੇਬਲ ਸਕੈਨ ਕਰੋ।',
    quickQuestions: [
      { label: '🥜 ਮੂੰਗਫਲੀ ਐਲਰਜੀ ਟੈਸਟ', text: 'ਮੂੰਗਫਲੀ ਦੀ ਐਲਰਜੀ ਅਤੇ ਸੁਰੱਖਿਅਤ ਬਦਲਾਂ ਬਾਰੇ ਦੱਸੋ।' },
      { label: '💖 ਰੋਜ਼ਾਨਾ ਸੋਡੀਅਮ ਟਾਰਗੇਟ', text: 'ਲੂਣ ਦੀ ਮਾਤਰਾ ਮੇਰੇ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਤੇ ਕੀ ਅਸਰ ਪਾਉਂਦੀ ਹੈ?' },
      { label: '💊 ਟਾਈਲੇਨੌਲ ਦਵਾਈ ਸਾਵਧਾਨੀ', text: 'ਕੀ ਮੈਂ ਟਾਈਲੇਨੌਲ ਗੋਲੀ ਖਾਣ ਦੇ ਨਾਲ ਗ੍ਰੇਪਫ੍ਰੂਟ ਜੂਸ ਪੀ ਸਕਦਾ ਹਾਂ?' },
      { label: '💧 ਪਾਣੀ ਦੀ ਜ਼ਰੂਰੀ ਮਾਤਰਾ', text: 'ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਆਮ ਰੱਖਣ ਲਈ ਰੋਜ਼ ਕਿੰਨਾ ਪਾਣੀ ਪੀਣਾ ਚਾਹੀਦਾ ਹੈ?' }
    ],
    templates: [
      { title: 'ਪੈਂਟਰੀ ਐਲਰਜੀ ਜਾਂਚ', text: 'ਮੇਰੀ ਰਸੋਈ ਦੀਆਂ ਚੀਜ਼ਾਂ ਵਿੱਚ ਐਲਰਜੀ ਵਾਲੇ ਤੱਤਾਂ ਦੀ ਜਾਂਚ ਕਰੋ।' },
      { title: 'ਦਵਾਈ ਦੇ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼', text: 'ਟਾਈਲੇਨੌਲ ਦੇ ਸੁਰੱਖਿਅਤ ਵਰਤੋਂ ਦੇ ਨਿਯਮ ਅਤੇ ਨੁਕਸਾਨ ਦਿਖਾਓ।' },
      { title: 'ਘੱਟ ਸੋਡੀਅਮ ਨਾਸ਼ਤਾ ਮੇਨੂ', text: 'ਮੇਰੀ ਰਸੋਈ ਸਮੱਗਰੀ ਤੋਂ ਕੱਲ੍ਹ ਲਈ ਘੱਟ ਲੂਣ ਵਾਲਾ ਨਾਸ਼ਤਾ ਤਿਆਰ ਕਰੋ।' }
    ]
  },
  ur: {
    welcome: 'Greetings John. میں آپ کا ہیلتھ گارڈ کلینیکل اسسٹنٹ ہوں، جو آپ کے فعال بائیو میٹرک ریکارڈ (32 سال، 78 کلوگرام)، مونگ پھلی الرجی، اور بلڈ پریشر سے ہم آہنگ ہے۔ میں نے آپ کی پینٹری کا کامیابی سے جائزہ لیا ہے۔ بولیں میں کس طرح رہنمائی کروں؟',
    peanut: '⚠️ مونگ پھلی الرجی انتباہ: آپ کے پروفائل میں مونگ پھلی سے الرجی ہے، پروسس شدہ نٹس یا کੂکیز سے پرہیز کریں۔ اور متبادل کے طور پر کدو کے بیج استعمال کریں۔',
    sodium: '💖 ہائی بلڈ پریشر کنٹرول: اپنے بلڈ پریشر کو معمول پر رکھنے کے لیے یومیہ سوڈیم کا استعمال 1500mg سے کم رکھیں۔ ناریل کا پانی مفید ثابت ہوگا۔',
    tylenol: '🚫 دواؤں کا انتباہ: آپ ٹائیلی نول دوا استعمال کر رہے ہیں، اس کے ساتھ گریپ فروٹ کا جوس ہرگز مت لیں، یہ جگر پر بوجھ بڑھا سکتا ہے۔',
    water: '💧 مناسب پانی پینے کی ہدایت: ہائی بلڈ پریشر کو کم کرنے کے لیے پانی پینا بہت ضروری ہے۔ روزانہ کم از کم 2.4L پانی پینے کی عادت بنائیں۔',
    default: '🩺 ہیلتھ گارڈ ڈیجیٹل تشخیص: رابطے کا شکریہ۔ الرجی کے خطرے کی جانچ کے لیے پینٹری میں موجود تمام کھانے کی اشیاء کا جائزہ لیں۔',
    quickQuestions: [
      { label: '🥜 مونگ پھلی الرجی ٹیسٹ', text: 'مونگ پھلی کی الرجی اور اس کے محفوظ متبادل بیان کریں۔' },
      { label: '💖 روزانہ سوڈیم ہدف', text: 'سوڈیم کا روزانہ استعمال میرے بلڈ پریشر کو کیسے متاثر کرتا ہے؟' },
      { label: '💊 ٹائیلی نول اور ڈرگ تفاعل', text: 'کیا میں ٹائیلی نول لینے کے دورانیے میں کھٹی چیزیں لے سکتا ہوں؟' },
      { label: '💧 پانی پینے کی مقدار', text: 'بلڈ پریشر متوازن کرنے کے لیے روزانہ کتنے پانی کی ضرورت ہے؟' }
    ],
    templates: [
      { title: 'پینٹری الرجی کا جائزہ', text: 'मेरी ਪੈਂਟਰੀ ਵਿਚ ਮੌਜੂਦ ਕਚਨ ਗ੍ਰੋਸਰੀ ਦਾ ਮੂੰਗਫਲੀ ਐਲਰਜੀ ਦੇ ਹਿਸਾਬ ਨਾਲ ਮੁਆਇਨਾ ਕਰੋ।' },
      { title: 'دواؤں کی رہنمائی', text: 'ٹائیلی نول کے محفوظ استعمال اور نقصانات کے بارے میں بتائیں۔' },
      { title: 'کم سوڈیم مینو گائیڈ', text: 'کل کے ناشتے کے لیے کم نمک والی ہیلتھی غذا کا منصوبہ تیار کریں۔' }
    ]
  }
};

const PRESET_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Greetings John. I am your HealthGuard Clinical Assistant, synchronizing with your active biometric file (32 y/o, 78kg), registered Peanut Allergies, and Mild Hypertension tracks. I have successfully analyzed your active pantry food items and medication dosages. How may I guide your systemic health alignments or dosage schedules today?',
    timestamp: '02:55 AM',
    type: 'telemetry'
  }
];

export function AIAssistantPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { language, t } = useLanguage();

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('hg_assistant_chat');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return PRESET_MESSAGES; }
    }
    return PRESET_MESSAGES;
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speechActiveId, setSpeechActiveId] = useState<string | null>(null);
  const [currentSpeechUtterance, setCurrentSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save chat log locally
  useEffect(() => {
    localStorage.setItem('hg_assistant_chat', JSON.stringify(messages));
  }, [messages]);

  // Handle autoscroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Clean speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Filter messages based on search query
  const filteredMessages = useMemo(() => {
    if (!chatSearchQuery.trim()) return messages;
    return messages.filter(m => m.text.toLowerCase().includes(chatSearchQuery.toLowerCase()));
  }, [messages, chatSearchQuery]);

  // Standard response builder for realistic clinical support (now multi-language keyword aware)
  const getClinicalReply = (input: string): { text: string; type: 'neutral' | 'clinical-alert' | 'clinical-success' | 'telemetry' } => {
    const text = input.toLowerCase();

    // 1. Peanut allergy responses
    if (
      text.includes('peanut') || text.includes('nut') || text.includes('allergy') ||
      text.includes('मूंगफली') || text.includes('நிலக்கடலை') || text.includes('cacahuet') ||
      text.includes('বাদাম') || text.includes('ஒவ்வாமை') || text.includes('शेंगदाणा') ||
      text.includes('శెనగ') || text.includes('ಮೂಡಲ')
    ) {
      return {
        text: AI_TRANSLATIONS[language]?.peanut || AI_TRANSLATIONS['en'].peanut,
        type: 'clinical-alert'
      };
    }

    // 2. Hypertension / sodium, salt responses  
    if (
      text.includes('hypertension') || text.includes('sodium') || text.includes('salt') || text.includes('pressure') || text.includes('vessel') ||
      text.includes('सोडियम') || text.includes('சோடியம்') || text.includes('रक्तचाप') || text.includes('இரத்த அழுத்தம்') ||
      text.includes('presión') || text.includes('tension') || text.includes('লবণ') || text.includes('ਲੂਣ') || text.includes('సోడియం')
    ) {
      return {
        text: AI_TRANSLATIONS[language]?.sodium || AI_TRANSLATIONS['en'].sodium,
        type: 'clinical-success'
      };
    }

    // 3. Tylenol / Acetaminophen / medicine / citrus / grapefruit
    if (
      text.includes('tylenol') || text.includes('acetaminophen') || text.includes('medicine') || text.includes('drug') || text.includes('citrus') || text.includes('grapefruit') ||
      text.includes('दवा') || text.includes('अंगूर') || text.includes('திராட்சை') || text.includes('டைலெனால்') ||
      text.includes('pomelo') || text.includes('pamplemousse') || text.includes('ٹائلینول')
    ) {
      return {
        text: AI_TRANSLATIONS[language]?.tylenol || AI_TRANSLATIONS['en'].tylenol,
        type: 'clinical-alert'
      };
    }

    // 4. Hydration / water / fluid
    if (
      text.includes('water') || text.includes('fluid') || text.includes('hydration') ||
      text.includes('पानी') || text.includes('தண்ணீர்') || text.includes('जल') ||
      text.includes('eau') || text.includes('agua') || text.includes('জল') || text.includes('ನೀರು')
    ) {
      return {
        text: AI_TRANSLATIONS[language]?.water || AI_TRANSLATIONS['en'].water,
        type: 'telemetry'
      };
    }

    // Default premium advice
    return {
      text: AI_TRANSLATIONS[language]?.default || AI_TRANSLATIONS['en'].default,
      type: 'neutral'
    };
  };

  // Helper to dynamically translate welcome/preset messages based on selected language
  const getMessageText = (msg: Message) => {
    if (msg.id === 'msg-1') {
      return AI_TRANSLATIONS[language]?.welcome || msg.text;
    }
    return msg.text;
  };

  // Trigger Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputValue;
    if (!rawText.trim() || isTyping) return;

    if (!textToSend) {
      setInputValue('');
    }

    const currentLocalTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMessage: Message = {
      id: `m-u-${Date.now()}`,
      sender: 'user',
      text: rawText.trim(),
      timestamp: currentLocalTime
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: rawText.trim(),
          history: updatedMessages,
          languageCode: language || 'en',
          context: {
            allergies: user?.allergies || ["Peanuts"],
            conditions: user?.healthConditions || ["Mild Hypertension"]
          }
        })
      });

      const data = await response.json();

      if (data && data.success && data.text) {
        const newAIMessage: Message = {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: data.type || 'neutral'
        };
        setMessages(prev => [...prev, newAIMessage]);
      } else {
        throw new Error("Invalid response form or success=false");
      }
    } catch (err) {
      console.error("Gemini Assistant API error, falling back to presets:", err);
      const response = getClinicalReply(rawText);
      const newAIMessage: Message = {
        id: `m-ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: response.type
      };
      setMessages(prev => [...prev, newAIMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Speech helper
  const handleToggleSpeech = (messageId: string, text: string) => {
    if (!window.speechSynthesis) {
      alert('Your browser does not support standard speech synthesis. Enjoy our visual companion details!');
      return;
    }

    // If already speaking this message, cancel it
    if (speechActiveId === messageId) {
      window.speechSynthesis.cancel();
      setSpeechActiveId(null);
      setCurrentSpeechUtterance(null);
      return;
    }

    // Stop existing speech
    window.speechSynthesis.cancel();

    // Create fresh utterance
    const speechText = text.replace(/[🚫⚠️❇️💖🩺💧]/g, ''); // strip emojis for cleaner audio
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onend = () => {
      setSpeechActiveId(null);
      setCurrentSpeechUtterance(null);
    };

    utterance.onerror = () => {
      setSpeechActiveId(null);
      setCurrentSpeechUtterance(null);
    };

    setSpeechActiveId(messageId);
    setCurrentSpeechUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  };

  // Copy helper
  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Reset Conversation
  const handleClearChatHistory = () => {
    if (window.confirm('Clear all conversation history with HealthGuard Companion?')) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setMessages(PRESET_MESSAGES);
      setSpeechActiveId(null);
      setInputValue('');
      setChatSearchQuery('');
    }
  };

  // Selected quick questions (now dynamically translated relative to active language)
  const quickQuestionsList = useMemo(() => {
    return AI_TRANSLATIONS[language]?.quickQuestions || AI_TRANSLATIONS['en'].quickQuestions;
  }, [language]);

  // Selected Screening templates (now dynamically translated relative to active language)
  const interactiveClinicalTemplates = useMemo(() => {
    return AI_TRANSLATIONS[language]?.templates || AI_TRANSLATIONS['en'].templates;
  }, [language]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 font-sans animate-fade-in max-w-[1440px] mx-auto h-[calc(100vh-3.5rem)] flex flex-col">
      
      {/* 1. TOP PREMIUM CONTEXT HEADER */}
      <div className="bg-gradient-to-r from-brand-primary-500/10 via-indigo-500/5 to-transparent border border-brand-primary-500/10 dark:border-brand-primary-500/15 rounded-[2rem] p-4 sm:p-6 shrink-0 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-brand-primary-500 text-white shadow-sm flex items-center justify-center">
            <MessageSquare size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-black tracking-widest text-brand-primary-600 dark:text-brand-primary-405">
                Clinical Companion System v4.0
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {t('header.aiAssistant') || 'HealthGuard AI Assistant'}
            </h1>
          </div>
        </div>

        {/* Outer Utilities */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {/* Clear Dialogue Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChatHistory}
            className="flex items-center gap-1.5 text-3xs font-extrabold uppercase tracking-wider text-rose-500 hover:bg-rose-50 border-rose-100 rounded-xl"
          >
            <Trash2 size={12} />
            <span>Clear Thread</span>
          </Button>

          {/* Connected Profile Status Indicator */}
          <span className="inline-flex items-center gap-2 text-3xs font-black uppercase tracking-wider px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200/55 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-xl">
            <Activity size={11} className="text-brand-primary-500 animate-pulse" />
            <span>Profile Synced</span>
          </span>
        </div>
      </div>

      {/* 2. THREE-SECTION CHAT WORKSPACE BODY */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
        
        {/* COLUMN A: INTERACTIVE CHAT ENGINE WITH DYNAMIC FEED (9 COLS FOR DOMINANCE) */}
        <div className="lg:col-span-9 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-[2.5rem] shadow-3xs overflow-hidden h-full">
          
          {/* Inner Search & Chat Header Row */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Interactive Session Thread
              </span>
              <span className="text-[10px] font-extrabold bg-brand-primary-50 dark:bg-brand-primary-950/20 text-brand-primary-650 dark:text-brand-primary-400 px-2 py-0.5 rounded-full border border-brand-primary-100">
                {messages.length} messages
              </span>
            </div>

            {/* Chat message search query bar */}
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search dialogue keywords..." 
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                className="w-full pl-8 pr-12 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-3xs font-bold rounded-xl text-slate-750 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-primary-555"
              />
              <Search size={12} className="absolute left-2.5 top-2.5 text-slate-400" />
              {chatSearchQuery && (
                <button 
                  onClick={() => setChatSearchQuery('')}
                  className="absolute right-2 px-1 text-3xs text-slate-400 hover:text-slate-600 font-extrabold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Interactive Chat Messages List Feed */}
          <div className="flex-1 overflow-y-auto px-8 py-8 sm:px-10 sm:py-10 space-y-8 scrollbar-thin scrollbar-thumb-slate-350 bg-slate-50/25 dark:bg-slate-955/10">
            <AnimatePresence initial={false}>
              {filteredMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isWarning = msg.type === 'clinical-alert';
                const isSuccess = msg.type === 'clinical-success';
                const isTelemetry = msg.type === 'telemetry';

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full group`}
                  >
                    <div className={`flex gap-3 max-w-xl sm:max-w-2xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      
                      {/* Message Avatar Icon */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border text-xs ${
                        isUser 
                          ? 'bg-indigo-50 border-indigo-205 text-indigo-600 dark:bg-indigo-950/20' 
                          : isWarning
                          ? 'bg-rose-50 border-rose-205 text-rose-555 dark:bg-rose-950/20'
                          : isSuccess
                          ? 'bg-emerald-50 border-emerald-205 text-emerald-555 dark:bg-emerald-950/20'
                          : 'bg-brand-primary-50 border-brand-primary-205 text-brand-primary-600 dark:bg-brand-primary-950/20'
                      }`}>
                        {isUser ? (
                          <User size={14} />
                        ) : isWarning ? (
                          <AlertTriangle size={14} className="animate-pulse" />
                        ) : isSuccess ? (
                          <Heart size={14} className="fill-current text-emerald-500 animate-pulse" />
                        ) : (
                          <Sparkle size={14} />
                        )}
                      </div>

                      {/* Message Content Bubble Container */}
                      <div className="space-y-1">
                        <div className={`p-4 rounded-3xl text-xs sm:text-sm font-medium leading-relaxed shadow-3xs ${
                          isUser 
                            ? 'bg-slate-900 border border-slate-950 text-white dark:bg-white dark:border-transparent dark:text-slate-950 rounded-tr-none'
                            : isWarning
                            ? 'bg-rose-50/40 dark:bg-rose-955/10 border-l-[4px] border-l-rose-500 border border-rose-100 dark:border-rose-950/20 text-rose-950 dark:text-rose-100 rounded-tl-none whitespace-pre-wrap font-semibold'
                            : isSuccess
                            ? 'bg-emerald-50/40 dark:bg-emerald-955/10 border-l-[4px] border-l-emerald-500 border border-emerald-100 dark:border-emerald-950/20 text-emerald-950 dark:text-emerald-100 rounded-tl-none whitespace-pre-wrap font-semibold'
                            : isTelemetry
                            ? 'bg-indigo-50/40 dark:bg-indigo-955/10 border border-indigo-100 dark:border-indigo-950/20 text-indigo-950 dark:text-indigo-100 rounded-tl-none whitespace-pre-wrap font-semibold'
                            : 'bg-slate-50 dark:bg-slate-950/50 border border-slate-150 dark:border-slate-805 text-slate-800 dark:text-slate-100 rounded-tl-none font-semibold'
                        }`}>
                          <p>{msg.text}</p>
                        </div>

                        {/* Message Action Utilities / Timing Details (revealed on hover for luxury interface) */}
                        <div className={`flex items-center gap-3.5 px-1.5 opacity-80 group-hover:opacity-100 transition-opacity text-4xs uppercase tracking-widest text-slate-400 font-extrabold ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <span>{msg.timestamp}</span>
                          {!isUser && (
                            <div className="flex items-center gap-2">
                              {/* Speak text button */}
                              <button
                                onClick={() => handleToggleSpeech(msg.id, msg.text)}
                                className={`hover:text-brand-primary-500 text-4xs font-bold transition-all flex items-center gap-1 ${
                                  speechActiveId === msg.id ? 'text-emerald-500 animate-pulse' : ''
                                }`}
                                title="Listen to Clinical Advice"
                              >
                                {speechActiveId === msg.id ? (
                                  <>
                                    <Volume2 size={11} className="text-emerald-500" />
                                    <span>Speaking...</span>
                                  </>
                                ) : (
                                  <>
                                    <VolumeX size={11} />
                                    <span>Audible Assist</span>
                                  </>
                                )}
                              </button>

                              {/* Copy button */}
                              <button
                                onClick={() => handleCopyText(msg.id, msg.text)}
                                className="hover:text-indigo-500 text-4xs font-bold transition-colors flex items-center gap-1"
                                title="Copy to clipboard"
                              >
                                {copiedId === msg.id ? (
                                  <>
                                    <Check size={11} className="text-emerald-500 animate-ping" />
                                    <span className="text-emerald-500">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy size={11} />
                                    <span>Copy Text</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}

              {/* Typing simulation block */}
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start w-full"
                >
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-xl bg-brand-primary-50 border border-brand-primary-150 flex items-center justify-center text-brand-primary-500 dark:bg-brand-primary-950/20">
                      <RefreshCw size={12} className="animate-spin text-brand-primary-512" />
                    </div>
                    <div className="p-4 bg-slate-100 pale:bg-slate-200 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-805 rounded-3xl rounded-tl-none flex items-center gap-1.5 shadow-2xs">
                      <span className="text-3xs font-black uppercase tracking-wider text-slate-400">
                        AI Clinical Specialist analyzing profile
                      </span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-555 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-555 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-555 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {filteredMessages.length === 0 && (
                <div className="p-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-2">
                  <Info size={28} className="mx-auto text-slate-350 dark:text-slate-700" />
                  <p className="text-2xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">
                    No dialog matching search keyword &quot;{chatSearchQuery}&quot; found in thread memory.
                  </p>
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* LOWER INPUT ROW PANEL */}
          <div className="group/presets p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-950/20 shrink-0 space-y-4">
            
            {/* Quick Click presets list pills */}
            <div className="opacity-0 max-h-0 overflow-hidden group-hover/presets:opacity-100 group-hover/presets:max-h-40 group-hover/presets:mb-2 transition-all duration-300 space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-brand-primary-500 animate-spin" />
                Select quick companion inquiry:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickQuestionsList.map(item => (
                  <button
                    key={item.label}
                    onClick={() => handleSendMessage(item.text)}
                    className="text-[10px] font-bold text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-brand-primary-500 hover:bg-slate-50 dark:hover:bg-slate-750 px-3.5 py-2 rounded-xl uppercase tracking-wider transition-all shadow-3xs cursor-pointer active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive text bar */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Submit custom questions (e.g., Is spicy pizza safe with my hypertension conditions?)..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                disabled={isTyping}
                className="w-full pl-4 pr-16 py-3.5 bg-white dark:bg-slate-950 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl text-xs font-semibold text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-500/25 select-text"
              />
              
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className={`absolute right-2 top-2 p-2.5 rounded-xl transition-all ${
                  inputValue.trim() && !isTyping
                    ? 'bg-brand-primary-500 text-white hover:scale-105 active:scale-95 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-350 cursor-not-allowed'
                }`}
              >
                <Send size={14} />
              </button>
            </div>

            {/* Suggested Followups Footer Section */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary-500" />
                <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                  Suggested Follow-ups
                </span>
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                {[
                  { text: "Check my next medication dose", display: "Medication Dose Check" },
                  { text: "Any new pantry alerts?", display: "Pantry Warnings" },
                  { text: "Review today's allergy flags", display: "Allergy Interventions" }
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(item.text)}
                    className="text-[10px] font-bold text-brand-primary-650 dark:text-brand-primary-400 bg-brand-primary-500/5 hover:bg-brand-primary-500/10 border border-brand-primary-500/10 hover:border-brand-primary-500/30 px-2.5 py-1 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {item.display}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN B: PATIENT PROFILE CONTEXT PANEL (3 COLS) */}
        <div className="lg:col-span-3 space-y-6 sm:space-y-8 overflow-y-auto pr-1">
          
          {/* USER SYNC PROFILE OVERVIEW */}
          <Card className="p-6 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] bg-white dark:bg-slate-900 shadow-3xs flex flex-col gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl border border-slate-100 dark:border-slate-850 overflow-hidden shrink-0 bg-slate-100 shadow-3xs">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                  {user?.name || 'John Doe'}
                </h3>
                <span className="text-[10px] font-black uppercase text-brand-primary-500 tracking-wider">
                  Sync Patient Context Profile
                </span>
              </div>
            </div>

            {/* Demographics grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-center">
              <div className="bg-slate-50/50 dark:bg-slate-950/20 p-2 border border-slate-100 dark:border-slate-805 rounded-xl">
                <span className="block text-[9px] font-extrabold uppercase text-slate-400">Profile Age</span>
                <span className="block text-xs font-bold text-slate-800 dark:text-white">32 y/o (Active)</span>
              </div>
              <div className="bg-slate-50/50 dark:bg-slate-950/20 p-2 border border-slate-100 dark:border-slate-805 rounded-xl">
                <span className="block text-[9px] font-extrabold uppercase text-slate-400">Total Weight</span>
                <span className="block text-xs font-bold text-slate-800 dark:text-white">{user?.weight || 78} {user?.weightUnit || 'kg'}</span>
              </div>
            </div>

            {/* Active profile tags */}
            <div className="space-y-3.5 pt-1">
              {/* Allergies tag field */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 text-rose-500">
                  <AlertTriangle size={10} /> Active Allergy Flags:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {user?.allergies?.map(al => (
                    <span key={al} className="text-3xs font-extrabold bg-rose-50 text-rose-600 dark:bg-rose-950/25 dark:text-rose-405 border border-rose-100/50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      🚨 Peanut Allergy
                    </span>
                  )) || (
                    <span className="text-3xs font-semibold text-slate-400">
                      No allergics cataloged
                    </span>
                  )}
                </div>
              </div>

              {/* Conditions Tag field */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 text-amber-500">
                  <Activity size={10} /> Clinical Conditions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {user?.healthConditions?.map(cond => (
                    <span key={cond} className="text-3xs font-extrabold bg-amber-50 text-amber-600 dark:bg-amber-950/25 dark:text-amber-405 border border-amber-100/50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      ⚠️ {cond}
                    </span>
                  )) || (
                    <span className="text-3xs font-semibold text-slate-400">
                      No baseline conditions cataloged
                    </span>
                  )}
                </div>
              </div>

              {/* Nutrition Targets */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1 text-brand-primary-500">
                  <ShieldCheck size={10} /> Nutrition Constraints:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {user?.dietaryPreferences?.map(pref => (
                    <span key={pref} className="text-3xs font-extrabold bg-brand-primary-50 text-brand-primary-650 dark:bg-brand-primary-950/25 dark:text-brand-primary-405 border border-brand-primary-100/50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      ✓ {pref}
                    </span>
                  )) || (
                    <span className="text-3xs font-semibold text-slate-400">
                      No nutrition constraints cataloged
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* QUICK INTERACTIVE SCREENING TEMPLATES */}
          <Card className="p-6 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] bg-white dark:bg-slate-900 shadow-3xs flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">
                AI Companion Fast Screens
              </h3>
              <p className="text-sm font-black text-slate-850 dark:text-slate-100 mt-0.5">
                Automated Clinical Protocols
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {interactiveClinicalTemplates.map(tmpl => (
                <button
                  key={tmpl.title}
                  onClick={() => handleSendMessage(tmpl.text)}
                  className="w-full text-left p-3 border border-slate-150 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 rounded-2xl flex items-center justify-between gap-3 text-3xs uppercase tracking-wider transition-all hover:scale-101"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-500">
                      <FileText size={12} />
                    </span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-350">{tmpl.title}</span>
                  </div>
                  <ChevronRight size={12} className="text-slate-400" />
                </button>
              ))}
            </div>
          </Card>

          {/* TELEMETRY ADHERENCE COMPLIANCE METER */}
          <Card className="p-6 border border-slate-200/60 dark:border-slate-800/80 rounded-[2rem] bg-indigo-600 text-white shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-[9px] font-black uppercase text-indigo-200">Adherence Monitoring</span>
                <h4 className="text-sm font-black tracking-tight mt-0.5">Cardiac Stability Metric</h4>
              </div>
              <Activity size={18} className="text-indigo-200 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-3xs font-extrabold tracking-wider uppercase">
                <span>Sodium Restricting Accuracy</span>
                <span>94% Adhered</span>
              </div>
              {/* Progress Bar visual indicator */}
              <div className="w-full bg-indigo-780 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[94%]" />
              </div>
            </div>

            <p className="text-[10px] text-indigo-150 leading-relaxed font-semibold">
              Keeping your current timeline sync with water (2.4L recommendation) and replacing salt-laden linguine secures maximum heart vascular elasticity.
            </p>
          </Card>

        </div>

      </div>

    </div>
  );
}

export default AIAssistantPage;
