// العناصر الأساسية في الواجهة
const amountInput = document.getElementById('amount');
const conversionType = document.getElementById('conversion-type');
const convertBtn = document.getElementById('convert-btn');
const resultElement = document.getElementById('result');
const rateInfoElement = document.getElementById('rate-info');
const oldCurrencyBtn = document.getElementById('old-currency');
const newCurrencyBtn = document.getElementById('new-currency');

// عناصر إدخال أسعار الصرف
const usdRateInput = document.getElementById('usd-rate-input');
const eurRateInput = document.getElementById('eur-rate-input');
const tryRateInput = document.getElementById('try-rate-input');
const saveRatesBtn = document.getElementById('save-rates-btn');
const resetRatesBtn = document.getElementById('reset-rates-btn');
const rateForNewBtn = document.getElementById('rate-for-new');
const rateForOldBtn = document.getElementById('rate-for-old');

// عناصر عرض الأسعار الحالية
const currentUsdRate = document.getElementById('current-usd-rate');
const currentEurRate = document.getElementById('current-eur-rate');
const currentTryRate = document.getElementById('current-try-rate');
const currentRateType = document.getElementById('current-rate-type');

// عناصر الأمثلة التوضيحية
const exampleUsd = document.getElementById('example-usd');
const exampleEur = document.getElementById('example-eur');

// متغير لتحديد نوع العملة السورية (قديمة/جديدة)
let isOldCurrency = true;

// متغير لتحديد نوع العملة لأسعار الصرف المدخلة
let isRateForNewCurrency = true;

// القيم الافتراضية لأسعار الصرف (كما طلبت)
const defaultRates = {
    USD: 11000,  // 1 دولار = 11000 ليرة سورية جديدة
    EUR: 12000,  // 1 يورو = 12000 ليرة سورية جديدة
    TRY: 300     // 1 ليرة تركية = 300 ليرة سورية جديدة
};

// أسعار الصرف الحالية
let exchangeRates = { ...defaultRates };

// تحميل أسعار الصرف المحفوظة من localStorage
function loadSavedRates() {
    const savedRates = localStorage.getItem('syrianCurrencyRates');
    const savedRateType = localStorage.getItem('rateType');

    if (savedRates) {
        exchangeRates = JSON.parse(savedRates);
    }

    if (savedRateType === 'old') {
        isRateForNewCurrency = false;
        rateForOldBtn.classList.add('active');
        rateForNewBtn.classList.remove('active');
        currentRateType.textContent = 'قديمة';

        // عرض القيم القديمة في الحقول
        usdRateInput.value = exchangeRates.USD;
        eurRateInput.value = exchangeRates.EUR;
        tryRateInput.value = exchangeRates.TRY;

        updateCurrentRatesDisplay();
    } else {
        currentRateType.textContent = 'جديدة';

        // عرض القيم الجديدة في الحقول
        usdRateInput.value = exchangeRates.USD;
        eurRateInput.value = exchangeRates.EUR;
        tryRateInput.value = exchangeRates.TRY;

        updateCurrentRatesDisplay();
    }

    // تحديث الأمثلة التوضيحية
    updateExamples();
}

// حفظ أسعار الصرف في localStorage
function saveRatesToStorage() {
    localStorage.setItem('syrianCurrencyRates', JSON.stringify(exchangeRates));
    localStorage.setItem('rateType', isRateForNewCurrency ? 'new' : 'old');
}

// تحديث عرض الأسعار الحالية
function updateCurrentRatesDisplay() {
    const usdValue = exchangeRates.USD.toLocaleString();
    const eurValue = exchangeRates.EUR.toLocaleString();
    const tryValue = exchangeRates.TRY.toLocaleString();

    if (isRateForNewCurrency) {
        currentUsdRate.textContent = `${usdValue} ل.س جديدة`;
        currentEurRate.textContent = `${eurValue} ل.س جديدة`;
        currentTryRate.textContent = `${tryValue} ل.س جديدة`;
        currentRateType.textContent = 'جديدة';
    } else {
        currentUsdRate.textContent = `${usdValue} ل.س قديمة`;
        currentEurRate.textContent = `${eurValue} ل.س قديمة`;
        currentTryRate.textContent = `${tryValue} ل.س قديمة`;
        currentRateType.textContent = 'قديمة';
    }
}

// تحديث الأمثلة التوضيحية
function updateExamples() {
    // تحويل 100,000 ليرة سورية قديمة إلى دولار ويورو
    const oldAmount = 100000;

    // حساب القيمة بالعملة الجديدة
    const newAmount = oldAmount / 100;

    // حساب القيمة بالدولار (بناءً على الأسعار المدخلة للعملة الجديدة)
    let usdRateForCalculation = exchangeRates.USD;
    if (!isRateForNewCurrency) {
        // إذا كانت الأسعار مدخلة للعملة القديمة، نحولها للجديدة
        usdRateForCalculation = exchangeRates.USD / 100;
    }

    const usdValue = newAmount / usdRateForCalculation;

    // حساب القيمة باليورو
    let eurRateForCalculation = exchangeRates.EUR;
    if (!isRateForNewCurrency) {
        eurRateForCalculation = exchangeRates.EUR / 100;
    }

    const eurValue = newAmount / eurRateForCalculation;

    exampleUsd.textContent = usdValue.toFixed(2);
    exampleEur.textContent = eurValue.toFixed(2);
}

// تبديل بين العملة القديمة والجديدة
oldCurrencyBtn.addEventListener('click', function () {
    isOldCurrency = true;
    oldCurrencyBtn.classList.add('active');
    newCurrencyBtn.classList.remove('active');
    updateConversionResult();
    updateExamples();
});

newCurrencyBtn.addEventListener('click', function () {
    isOldCurrency = false;
    newCurrencyBtn.classList.add('active');
    oldCurrencyBtn.classList.remove('active');
    updateConversionResult();
    updateExamples();
});

// تبديل بين نوع العملة لأسعار الصرف
rateForNewBtn.addEventListener('click', function () {
    isRateForNewCurrency = true;
    rateForNewBtn.classList.add('active');
    rateForOldBtn.classList.remove('active');
    currentRateType.textContent = 'جديدة';
    updateCurrentRatesDisplay();
    updateExamples();
    updateConversionResult();
});

rateForOldBtn.addEventListener('click', function () {
    isRateForNewCurrency = false;
    rateForOldBtn.classList.add('active');
    rateForNewBtn.classList.remove('active');
    currentRateType.textContent = 'قديمة';
    updateCurrentRatesDisplay();
    updateExamples();
    updateConversionResult();
});

// حفظ أسعار الصرف المدخلة
saveRatesBtn.addEventListener('click', function () {
    // التحقق من صحة المدخلات
    const usdRate = parseFloat(usdRateInput.value);
    const eurRate = parseFloat(eurRateInput.value);
    const tryRate = parseFloat(tryRateInput.value);

    if (!usdRate || usdRate <= 0 || !eurRate || eurRate <= 0 || !tryRate || tryRate <= 0) {
        alert("يرجى إدخال أسعار صرف صحيحة (أرقام أكبر من صفر)");
        return;
    }

    // حفظ الأسعار المدخلة
    exchangeRates.USD = usdRate;
    exchangeRates.EUR = eurRate;
    exchangeRates.TRY = tryRate;

    // حفظ في التخزين المحلي
    saveRatesToStorage();

    // تحديث العرض
    updateCurrentRatesDisplay();
    updateConversionResult();
    updateExamples();

    // إظهار رسالة تأكيد
    const rateTypeText = isRateForNewCurrency ? "جديدة" : "قديمة";
    alert(`تم حفظ أسعار الصرف للعملة السورية ${rateTypeText} بنجاح!\n\nالدولار: ${usdRate.toLocaleString()}\nاليورو: ${eurRate.toLocaleString()}\nالليرة التركية: ${tryRate.toLocaleString()}`);
});

// استعادة القيم الافتراضية
resetRatesBtn.addEventListener('click', function () {
    if (confirm("هل تريد استعادة القيم الافتراضية لأسعار الصرف؟\n\nالدولار: 11,000\nاليورو: 12,000\nالليرة التركية: 300\n\nسيتم فقدان القيم الحالية.")) {
        exchangeRates = { ...defaultRates };

        // تحديث الحقول بالقيم الافتراضية
        usdRateInput.value = exchangeRates.USD;
        eurRateInput.value = exchangeRates.EUR;
        tryRateInput.value = exchangeRates.TRY;

        // تعيين النوع إلى العملة الجديدة
        isRateForNewCurrency = true;
        rateForNewBtn.classList.add('active');
        rateForOldBtn.classList.remove('active');
        currentRateType.textContent = 'جديدة';

        // حفظ في التخزين المحلي
        saveRatesToStorage();

        // تحديث العرض
        updateCurrentRatesDisplay();
        updateConversionResult();
        updateExamples();

        alert("تم استعادة القيم الافتراضية بنجاح!");
    }
});

// تحديث نتيجة التحويل
function updateConversionResult() {
    const amount = parseFloat(amountInput.value) || 0;
    const conversion = conversionType.value;

    let result = 0;
    let rateInfo = "";

    // تحديد سعر الصرف بناءً على نوع العملة المدخلة ونوع العملة المحددة
    let usdRate = exchangeRates.USD;
    let eurRate = exchangeRates.EUR;
    let tryRate = exchangeRates.TRY;

    // إذا كانت الأسعار مدخلة للعملة القديمة ولكن التحويل من العملة الجديدة
    if (!isRateForNewCurrency && !isOldCurrency && conversion.includes('syp-to-')) {
        usdRate = exchangeRates.USD / 100;
        eurRate = exchangeRates.EUR / 100;
        tryRate = exchangeRates.TRY / 100;
    }
    // إذا كانت الأسعار مدخلة للعملة الجديدة ولكن التحويل من العملة القديمة
    else if (isRateForNewCurrency && isOldCurrency && conversion.includes('syp-to-')) {
        usdRate = exchangeRates.USD * 100;
        eurRate = exchangeRates.EUR * 100;
        tryRate = exchangeRates.TRY * 100;
    }

    switch (conversion) {
        case 'syp-to-usd':
            result = amount / usdRate;
            rateInfo = `سعر الصرف: 1 دولار = ${usdRate.toLocaleString()} ليرة سورية ${isOldCurrency ? 'قديمة' : 'جديدة'}`;
            resultElement.innerHTML = `${result.toFixed(4)} <span class="currency-symbol">USD</span>`;
            break;

        case 'syp-to-eur':
            result = amount / eurRate;
            rateInfo = `سعر الصرف: 1 يورو = ${eurRate.toLocaleString()} ليرة سورية ${isOldCurrency ? 'قديمة' : 'جديدة'}`;
            resultElement.innerHTML = `${result.toFixed(4)} <span class="currency-symbol">EUR</span>`;
            break;

        case 'syp-to-try':
            result = amount / tryRate;
            rateInfo = `سعر الصرف: 1 ليرة تركية = ${tryRate.toLocaleString()} ليرة سورية ${isOldCurrency ? 'قديمة' : 'جديدة'}`;
            resultElement.innerHTML = `${result.toFixed(4)} <span class="currency-symbol">TRY</span>`;
            break;

        case 'old-to-new':
            result = amount / 100;
            rateInfo = `سعر التحويل: 100 ليرة سورية قديمة = 1 ليرة سورية جديدة`;
            resultElement.innerHTML = `${result.toFixed(2)} <span class="currency-symbol">ليرة سورية جديدة</span>`;
            break;

        case 'new-to-old':
            result = amount * 100;
            rateInfo = `سعر التحويل: 1 ليرة سورية جديدة = 100 ليرة سورية قديمة`;
            resultElement.innerHTML = `${result.toLocaleString()} <span class="currency-symbol">ليرة سورية قديمة</span>`;
            break;
    }

    rateInfoElement.textContent = rateInfo;
}

// إضافة مستمعي الأحداث
convertBtn.addEventListener('click', updateConversionResult);
amountInput.addEventListener('input', updateConversionResult);
conversionType.addEventListener('change', updateConversionResult);

// تحديث تلقائي عند تغيير أسعار الصرف
usdRateInput.addEventListener('input', function () {
    const usdRate = parseFloat(usdRateInput.value) || exchangeRates.USD;
    const rateTypeText = isRateForNewCurrency ? "جديدة" : "قديمة";
    currentUsdRate.textContent = `${usdRate.toLocaleString()} ل.س ${rateTypeText}`;
    updateExamples();
});

eurRateInput.addEventListener('input', function () {
    const eurRate = parseFloat(eurRateInput.value) || exchangeRates.EUR;
    const rateTypeText = isRateForNewCurrency ? "جديدة" : "قديمة";
    currentEurRate.textContent = `${eurRate.toLocaleString()} ل.س ${rateTypeText}`;
    updateExamples();
});

tryRateInput.addEventListener('input', function () {
    const tryRate = parseFloat(tryRateInput.value) || exchangeRates.TRY;
    const rateTypeText = isRateForNewCurrency ? "جديدة" : "قديمة";
    currentTryRate.textContent = `${tryRate.toLocaleString()} ل.س ${rateTypeText}`;
    updateExamples();
});

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function () {
    // تحميل الأسعار المحفوظة
    loadSavedRates();

    // تحديث النتيجة الأولى
    updateConversionResult();

    // إضافة تأثير عند النقر على أزرار التحويل
    convertBtn.addEventListener('click', function () {
        this.style.transform = "scale(0.98)";
        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 150);
    });

    saveRatesBtn.addEventListener('click', function () {
        this.style.transform = "scale(0.98)";
        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 150);
    });

    resetRatesBtn.addEventListener('click', function () {
        this.style.transform = "scale(0.98)";
        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 150);
    });
});

// توليد قيم عشوائية للمبلغ عند النقر المزدوج على حقل الإدخال
amountInput.addEventListener('dblclick', function () {
    if (isOldCurrency) {
        this.value = Math.floor(Math.random() * 1000000) + 100000; // بين 100,000 و 1,100,000
    } else {
        this.value = Math.floor(Math.random() * 10000) + 1000; // بين 1,000 و 11,000
    }
    updateConversionResult();
});

// توليد أسعار صرف واقعية عند النقر المزدوج على حقول الأسعار
usdRateInput.addEventListener('dblclick', function () {
    if (isRateForNewCurrency) {
        this.value = Math.floor(Math.random() * 2000) + 10000; // بين 10,000 و 12,000
    } else {
        this.value = Math.floor(Math.random() * 200000) + 1000000; // بين 1,000,000 و 1,200,000
    }
    updateCurrentRatesDisplay();
    updateExamples();
});

eurRateInput.addEventListener('dblclick', function () {
    if (isRateForNewCurrency) {
        this.value = Math.floor(Math.random() * 2000) + 11000; // بين 11,000 و 13,000
    } else {
        this.value = Math.floor(Math.random() * 200000) + 1100000; // بين 1,100,000 و 1,300,000
    }
    updateCurrentRatesDisplay();
    updateExamples();
});

tryRateInput.addEventListener('dblclick', function () {
    if (isRateForNewCurrency) {
        this.value = Math.floor(Math.random() * 100) + 250; // بين 250 و 350
    } else {
        this.value = Math.floor(Math.random() * 10000) + 25000; // بين 25,000 و 35,000
    }
    updateCurrentRatesDisplay();
    updateExamples();
});
