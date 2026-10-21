import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutWorkshop from './components/AboutWorkshop';
import Services from './components/Services';
import ReviewRiver from './components/ReviewRiver';
import WorkshopGallery from './components/WorkshopGallery';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import MobileQuickBar from './components/MobileQuickBar';
import DynamicCorporateSite, { DynamicSiteInfo } from './components/DynamicCorporateSite';

const SEED_SITES_CLIENT: Record<string, DynamicSiteInfo> = {
  'sweden-pizza': {
    n: 'Sweden Pizza',
    a: 'Etlik, Etlik Cd No:128/D, 06010 Keçiören/Ankara, Türkiye',
    p: '+90 312 326 43 63',
    c: 'Pizza Restoranı',
    s: 'pizza_italian',
    q: 'Sweden Pizza, Etlik, Etlik Cd No:128/D, 06010 Keçiören/Ankara, Türkiye',
    u: 'https://maps.app.goo.gl/F2Vz8UzzreoNzbBo6?g_st=ic',
    bio: 'Sweden Pizza, 35 yıllık tecrübesiyle pizzayı sadece yemek değil, keyifli bir anıya dönüştürüyor. Özenle dinlendirilmiş hamurumuz, kendi mutfağımızda hazırladığımız özgün soslarımız, kaliteli peynir ve seçkin et ürünlerimiz ile her gün taze seçilen sebzelerimiz bir araya geliyor.',
    hr: 'Hafta İçi: 11:00 – 22:00 • Hafta Sonu: 12:00 – 22:00',
    rt: '4.9',
    rc: 227,
    pm: 'auto',
  },
  'bagdat-tatlisi-lokantasi': {
    n: 'Bağdat Tatlısı Bağdat Lokantası',
    a: 'G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    p: '+90 312 229 63 18',
    c: 'Tatlıcı • Geleneksel Lokanta',
    s: 'traditional_dessert',
    q: 'Bağdat Tatlısı Bağdat Lokantası, G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    u: 'https://maps.app.goo.gl/VWpfdcWe9UU4fZAP8?g_st=ic',
    bio: 'Kurucusu olduğumuz Bağdat Lokantası ve eşsiz lezzeti Bağdat tatlısı 45 yıldır aynı yerinde ve aynı lezzetle misafirlerine hizmet vermeye devam etmektedir.',
    hr: 'Pazartesi – Cumartesi: 08:30 – 20:00',
    rt: '4.7',
    rc: 328,
    pm: 'auto',
  },
  'bagdat-tatlisi-bagdat-lokantasi': {
    n: 'Bağdat Tatlısı Bağdat Lokantası',
    a: 'G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    p: '+90 312 229 63 18',
    c: 'Tatlıcı • Geleneksel Lokanta',
    s: 'traditional_dessert',
    q: 'Bağdat Tatlısı Bağdat Lokantası, G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    u: 'https://maps.app.goo.gl/VWpfdcWe9UU4fZAP8?g_st=ic',
    bio: 'Kurucusu olduğumuz Bağdat Lokantası ve eşsiz lezzeti Bağdat tatlısı 45 yıldır aynı yerinde ve aynı lezzetle misafirlerine hizmet vermeye devam etmektedir.',
    hr: 'Pazartesi – Cumartesi: 08:30 – 20:00',
    rt: '4.7',
    rc: 328,
    pm: 'auto',
  },
  'bagdat-tatlisi': {
    n: 'Bağdat Tatlısı Bağdat Lokantası',
    a: 'G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    p: '+90 312 229 63 18',
    c: 'Tatlıcı • Geleneksel Lokanta',
    s: 'traditional_dessert',
    q: 'Bağdat Tatlısı Bağdat Lokantası, G.M.K Bulvarı, Şht. Danış Tunalıgil Sk. No:6/B, 06570 Çankaya/Ankara, Türkiye',
    u: 'https://maps.app.goo.gl/VWpfdcWe9UU4fZAP8?g_st=ic',
    bio: 'Kurucusu olduğumuz Bağdat Lokantası ve eşsiz lezzeti Bağdat tatlısı 45 yıldır aynı yerinde ve aynı lezzetle misafirlerine hizmet vermeye devam etmektedir.',
    hr: 'Pazartesi – Cumartesi: 08:30 – 20:00',
    rt: '4.7',
    rc: 328,
    pm: 'auto',
  },
  'diestro-garage': {
    n: 'Diestro Garage',
    a: 'İvedik OSB, Yenimahalle / Ankara',
    p: '0530 916 09 61',
    c: 'Boya Koruma • Pasta Cila • Seramik Kaplama • PPF • Detailing',
    s: 'auto_detailing',
    q: 'Diestro Garage, İvedik OSB, Yenimahalle / Ankara',
    u: 'https://www.instagram.com/diestrogarage/',
    l: '/diestro-logo.jpg',
    logo: '/diestro-logo.jpg',
    pm: 'auto',
  },
  'coffe-rozz': {
    n: 'Coffe Rozz',
    a: 'Çankaya / Ankara',
    p: '0544 477 56 57',
    c: 'Üçüncü Nesil Kahve • Espresso Bar • Taze Tatlılar',
    s: 'cafe_dessert',
    q: 'Coffe Rozz, Çankaya / Ankara',
    u: 'https://www.instagram.com/cofferozz/',
    l: '/cofferozz-logo.jpg',
    logo: '/cofferozz-logo.jpg',
    pm: 'auto',
  },
  'gada-coffee-eatery': {
    n: 'GADA Coffee & Eatery',
    a: 'Güvenevler, Kıbrıs Sk. 29-B, 06690 Çankaya/Ankara',
    p: '0506 844 79 76',
    c: '3. Nesil Kahve • Glutensiz & Vegan Mutfak • Gurme Sandviç & Bowl',
    s: 'cafe_dessert',
    q: 'GADA Coffee & Eatery, Güvenevler, Kıbrıs Sk. 29-B, 06690 Çankaya/Ankara',
    u: 'https://share.google/MbNxAFEuisYWmYwlb',
    pm: 'auto',
    bio: 'Ayrancı Güvenevler Kıbrıs Sokak’ta 2021 yılından bu yana 3. nesil nitelikli kahve kültürünü; glutensiz ve vegan dostu mutfak anlayışı, ekşi mayalı gurme sandviçler, sağlıklı bowl tabakları ve el açması özel soslu gözlemelerle buluşturuyoruz.',
    hr: 'Hafta İçi & Cumartesi: 08:00 – 22:00 • Pazar: 10:00 – 19:00',
    rt: '4.9',
    rc: 157,
    ph: [
      '/images/gada-coffee-eatery/1.jpg',
      '/images/gada-coffee-eatery/2.jpg',
      '/images/gada-coffee-eatery/3.jpg',
      '/images/gada-coffee-eatery/4.jpg',
      '/images/gada-coffee-eatery/5.jpg',
      '/images/gada-coffee-eatery/6.jpg',
    ],
    photos: [
      '/images/gada-coffee-eatery/1.jpg',
      '/images/gada-coffee-eatery/2.jpg',
      '/images/gada-coffee-eatery/3.jpg',
      '/images/gada-coffee-eatery/4.jpg',
      '/images/gada-coffee-eatery/5.jpg',
      '/images/gada-coffee-eatery/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'V60 Nitelikli Demleme & 3. Nesil Kahve',
        desc: 'Taze kavrulmuş üst segment kahve çekirdeklerinin aromatik notalarını tam kıvamında sunan V60 demleme ve espresso bazlı kahveler.',
        detail: 'V60 Demleme • %100 Arabica • Taze Çekirdek',
      },
      {
        num: '02',
        title: 'Dana Fümeli & Glutensiz Gurme Sandviçler',
        desc: 'Özel yapım taze ekmekler ve glutensiz alternatiflerle hazırlanan dana fümeli, peynirli ve taze yeşillikli doyurucu sandviçler.',
        detail: 'Dana Fümeli • Glutensiz Seçenek • Günlük Ekmek',
      },
      {
        num: '03',
        title: 'Glutensiz & Vegan Dostu Mutfak',
        desc: 'Farklı beslenme tercihlerine özenle hazırlanan %100 glutensiz ve bitkisel (vegan) sıcak-soğuk tabaklar ve tatlılar.',
        detail: 'Glutensiz • Vegan & Vejetaryen • Sağlıklı Reçete',
      },
      {
        num: '04',
        title: 'Özel Yoğurt Soslu El Açması Gözleme',
        desc: 'Sipariş üzerine sıcak hazırlanan ve özel yoğurtlu-baharatlı sos dokunuşuyla servis edilen imza gözleme lezzetimiz.',
        detail: 'Özel Yoğurtlu Sos • Sıcak Hazırlık • İmza Lezzet',
      },
      {
        num: '05',
        title: 'Sağlıklı Bowl, Salata & Tost Çeşitleri',
        desc: 'Taze mevsim sebzeleri, tahıllar ve doğal soslarla dengelenmiş besleyici kase (bowl) ve sıcak tost alternatifleri.',
        detail: 'Besleyici Bowl • Taze Salata • Dengeli Öğün',
      },
      {
        num: '06',
        title: 'Butik Tasarım Mağaza & Pet-Friendly Ortam',
        desc: 'Patili dostlarınızla birlikte keyifle vakit geçirebileceğiniz sıcak atmosfer ve özgün tasarım aksesuar köşemiz.',
        detail: 'Hayvan Dostu (Pet Friendly) • Tasarım Köşesi • Ayrancı',
      },
    ],
    reviews: [
      {
        author: 'Tangün Caner',
        role: 'Google Yorumu',
        group: 'Nitelikli Kahve & Sandviç',
        text: 'Ayrancı’da hem nitelikli kahve içip hem de gerçek bir sandviç yiyebileceğimiz bir yer bulduk. Kahveleri gerçekten üst segment, yanında denediğimiz yoğurt soslu gözleme ve glütensiz sandviç çok lezzetli ve doyurucuydu.',
      },
      {
        author: 'Fatma Ceyhan',
        role: 'Google Yorumu',
        group: 'V60 Demleme & 3. Nesil Kahve',
        text: 'Ayrancı’da nitelikli kahve içebileceğiniz nadir noktalardan biri. Özellikle V60 demleme konusunda çok hassaslar. Çekirdeğin notalarını tam olması gerektiği gibi alabiliyorsunuz.',
      },
      {
        author: 'İf Fet',
        role: 'Google Yorumu',
        group: 'Glutensiz & Vegan Menü',
        text: 'Dükkanın enerjisi çok yüksek, ekip çok ilgili. Kendimi evimde gibi hissettiğim mekanlardan. Yemek menüsünde herkes düşünülmüş, glutensiz ve vegan yemekler de var.',
      },
      {
        author: 'Doğa Baysal',
        role: 'Google Yorumu',
        group: 'Yoğurt Soslu Gözleme',
        text: 'Çok lezzetli bir gözlemeydi. Çalışanlar çok güler yüzlüydü. Özellikle yoğurtlu sosa bayıldık, gözlemeye adeta seviye atlatmış.',
      },
    ],
  },
  'koala-coffee-shop': {
    n: 'Koala Coffee Shop',
    a: 'Barbaros, Bülten Sk. No:21-C, 06660 Çankaya/Ankara',
    p: '0542 151 65 06',
    c: '3. Nesil Kahve • Ev Yapımı Tatlılar • Butik Kafe',
    s: 'cafe_dessert',
    q: 'Koala Coffee Shop, Barbaros, Bülten Sk. No:21-C, 06660 Çankaya/Ankara',
    u: 'https://share.google/CrmptmO8mkwKoazMD',
    pm: 'auto',
    bio: '2016 yılından bu yana Tunalı Bülten Sokak’ta sakin, huzurlu ve hayvan dostu atmosferiyle misafirlerini ağırlayan Koala Coffee Shop; taze demlenen kahveleri ve günlük tatlılarıyla şehrin kalbinde samimi bir mola noktası sunuyor.',
    hr: 'Hafta İçi: 11:00 – 23:00 • Hafta Sonu: 10:00 – 00:00',
    rt: '4.5',
    rc: 428,
    ph: [
      '/images/koala-coffee-shop/1.jpg',
      '/images/koala-coffee-shop/2.jpg',
      '/images/koala-coffee-shop/3.jpg',
      '/images/koala-coffee-shop/4.jpg',
      '/images/koala-coffee-shop/5.jpg',
      '/images/koala-coffee-shop/6.jpg',
    ],
    photos: [
      '/images/koala-coffee-shop/1.jpg',
      '/images/koala-coffee-shop/2.jpg',
      '/images/koala-coffee-shop/3.jpg',
      '/images/koala-coffee-shop/4.jpg',
      '/images/koala-coffee-shop/5.jpg',
      '/images/koala-coffee-shop/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'Espresso Bazlı Nitelikli Kahveler',
        desc: 'Taze kavrulmuş çekirdeklerden hazırlanan Latte, Cappuccino, Flat White, Americano ve aromatik sıcak kahve çeşitleri.',
        detail: 'Taze Çekirdek • Usta Barista • Dengeli İçim',
      },
      {
        num: '02',
        title: 'Ev Yapımı Tiramisu & Günlük Tatlılar',
        desc: 'Kahvenizin yanına eşlik eden tam kıvamında ev yapımı tiramisu, cheesecake ve günlük taze vitrin tatlıları.',
        detail: 'Günlük Taze • Ev Yapımı Tiramisu • Hafif Lezzet',
      },
      {
        num: '03',
        title: 'Buzlu Kahveler & Yazlık Soğuk İçecekler',
        desc: 'Sıcak günlerde ferahlatan Iced Latte, Cold Brew, Iced Americano ve doğal meyveli soğuk içecek alternatifleri.',
        detail: 'Soğuk Demleme • Buzlu Sunum • Ferahlatıcı',
      },
      {
        num: '04',
        title: 'Üçüncü Nesil Filtre & Demleme Kahve',
        desc: 'Günlük taze öğütülerek demlenen filtre kahve ve tek kökenli nitelikli kahve seçenekleri.',
        detail: 'Günlük Öğütüm • Yumuşak İçim • Zengin Aroma',
      },
      {
        num: '05',
        title: 'Taze Demleme Çay & Bitki Çayları',
        desc: 'Uzun sohbetlerinize eşlik eden taze demleme çay, doğal kış ve bitki çayı harmanları.',
        detail: 'Sıcak İkram • Doğal Bitki Çayları • Samimi Sunum',
      },
      {
        num: '06',
        title: 'Bülten Sokak Bahçe & Hayvan Dostu Ortam',
        desc: '2016’dan beri Bülten Sokak’ın kalabalığından uzak, hayvansever ve huzurlu iç-dış mekan atmosferi.',
        detail: '2016’dan Beri • Hayvan Dostu • Sakin Bahçe',
      },
    ],
    reviews: [
      {
        author: 'Hasan Özkara',
        role: 'Google Yorumu',
        group: 'Tiramisu & Kahve',
        text: 'Bülten Sokağın kalabalığından etkilenmemiş, sakin ve sıcak bir yer. Tiramisu ve kahveler çok güzeldi, fiyatları da gayet makul. Sade ve samimi bir atmosferi var.',
      },
      {
        author: 'Eda Altuntaş',
        role: 'Google Yorumu',
        group: 'Tatlılar & Hayvan Dostu Ortam',
        text: 'İçecekleri ve tatlıları çok lezzetli. Çalışanlar ilgili ve sıcakkanlılar. Ayrıca hayvansever olmaları çok hoşuma gitti, arkadaşlarınızla keyifle gidebileceğiniz güzel bir mekan.',
      },
      {
        author: 'Yağmur Çelik',
        role: 'Google Yorumu',
        group: 'Kahve & Mekan',
        text: 'Kahveleri ve ortamı çok iyi, Ankara’da bulunduğum süre boyunca keyifle vakit geçirdiğim favori konumum oldu.',
      },
      {
        author: 'Serhan Toprak',
        role: 'Google Yorumu',
        group: 'Atmosfer & Lezzet',
        text: 'Çok huzurlu ve keyifli bir ortam, çok severek geliyoruz. Kahveleri her zaman taze ve lezzetli.',
      },
    ],
  },
  'sloth-coffee-shop': {
    n: 'Sloth Coffee Shop',
    a: 'Ayrancı, Güvenlik Cd. 36/A, 06540 Çankaya/Ankara',
    p: '0538 417 56 84',
    c: 'Kahve Dükkanı • Ev Yapımı Kek, Kurabiye & Sandviç',
    s: 'cafe_dessert',
    q: 'Sloth Coffee Shop, Ayrancı, Güvenlik Cd. 36/A, 06540 Çankaya/Ankara',
    u: 'https://share.google/nloykhv1qQvTwpMv6',
    pm: 'auto',
    bio: 'Ayrancı Güvenlik Caddesi’nde tüm tatlı, kek, kurabiye ve sandviçlerini kendi mutfağında ev yapımı olarak hazırlayan Sloth Coffee Shop; içerideki taze fırın kokusu, dingin müzikleri ve sıcak atmosferiyle ev konforunda bir kahve deneyimi sunuyor.',
    hr: 'Her Gün: 08:30 – 23:00',
    rt: '4.5',
    rc: 376,
    ph: [
      '/images/sloth-coffee-shop/1.jpg',
      '/images/sloth-coffee-shop/2.jpg',
      '/images/sloth-coffee-shop/3.jpg',
      '/images/sloth-coffee-shop/4.jpg',
      '/images/sloth-coffee-shop/5.jpg',
      '/images/sloth-coffee-shop/6.jpg',
    ],
    photos: [
      '/images/sloth-coffee-shop/1.jpg',
      '/images/sloth-coffee-shop/2.jpg',
      '/images/sloth-coffee-shop/3.jpg',
      '/images/sloth-coffee-shop/4.jpg',
      '/images/sloth-coffee-shop/5.jpg',
      '/images/sloth-coffee-shop/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'Nitelikli Espresso & Taze Demleme Kahveler',
        desc: 'Seçkin çekirdeklerden anında öğütülerek hazırlanan Latte, Americano, Cappuccino ve filtre kahve çeşitleri.',
        detail: 'Taze Öğütüm • Dengeli Aroma • Sıcak & Soğuk',
      },
      {
        num: '02',
        title: 'Ev Yapımı Fırından Sıcak Kek & Kurabiyeler',
        desc: 'Kendi mutfağımızda günlük olarak pişirilen, tüm mekana tatlı ev mutfağı kokusu yayan taze kek ve kurabiyelerimiz.',
        detail: '%100 Ev Yapımı • Günlük Fırından • Doğal Malzeme',
      },
      {
        num: '03',
        title: 'Günlük Ev Yapımı Sandviç Çeşitleri',
        desc: 'Taze ekmekler ve özenle seçilen şarküteri-peynir malzemeleriyle sipariş üzerine hazırlanan doyurucu sandviçler.',
        detail: 'Taze Hazırlık • Ev Yapımı Soslar • Doyurucu Öğün',
      },
      {
        num: '04',
        title: 'Günlük Butik Tatlılar & Pastalar',
        desc: 'Kahve keyfinize eşlik eden, tamamı kendi üretimimiz olan günlük taze tatlı ve pasta alternatifleri.',
        detail: 'Kendi Üretimimiz • Taze Sunum • Hafif Reçete',
      },
      {
        num: '05',
        title: 'Sıcak Demleme Çay & Bitki Çayları',
        desc: 'Soğuk Ankara akşamlarında içinizi ısıtan taze demlenmiş çay ve doğal bitki çayı çeşitlerimiz.',
        detail: 'Taze Demleme • Kış Çayları • Sıcak Atmosfer',
      },
      {
        num: '06',
        title: 'Kitap Okuma & Sakin Sohbet Ortamı',
        desc: 'Dingin müzik listesi, özenli dekorasyonu ve huzurlu atmosferiyle kitap okumak veya dostlarla sohbet etmek için ideal alan.',
        detail: 'Dingin Müzik • Sıcak Dekorasyon • Güvenlik Caddesi',
      },
    ],
    reviews: [
      {
        author: 'Çağlar Akay',
        role: 'Google Yorumu',
        group: 'Ev Yapımı Kek & Kahve',
        text: 'Yıllardır severek gelirim, ürün kalitesini çok beğeniyorum. İçeride tatlı bir ev mutfağında sohbet eşliğinde kek ve kahve kokusu var. Müzikler ortamın sakin havasına çok uygun.',
      },
      {
        author: 'Orkun K.',
        role: 'Google Yorumu',
        group: 'Kek, Kurabiye & Çay',
        text: 'Soğuk bir Ankara akşamında yürüyüş sonrası girip çay içip kek ve kurabiye yediğimiz çok tatlı bir işletme. Kek tam bir ev keki kıvamındaydı, kurabiyeler de çok lezzetliydi.',
      },
      {
        author: 'Yasin Çiftçi',
        role: 'Google Yorumu',
        group: 'Kitap & Kahve Molası',
        text: 'Arkadaşınla keyifli sohbetler yapmalık veya kahveni yudumlarken kitabını alıp zaman geçirmelik çok hoş ve huzurlu bir kafe.',
      },
      {
        author: 'Selin A.',
        role: 'Google Yorumu',
        group: 'Ev Yapımı Sandviç & Tatlı',
        text: 'Hem sandviçlerinin hem de tatlılarının kendi mutfaklarında yapıldığı ilk lokmada belli oluyor. Güvenlik Caddesi’nin en samimi durağı.',
      },
    ],
  },
  'padam-coffee-shop': {
    n: 'Padam Coffee Shop',
    a: 'Remzi Oğuz Arık Mah., Atatürk Blv. No:237 D:16, 06680 Çankaya/Ankara',
    p: '0312 426 77 26',
    c: '3. Nesil Kahve • İtalyan Tiramisu & Butik Tatlılar',
    s: 'cafe_dessert',
    q: 'Padam Coffee Shop, Remzi Oğuz Arık, Atatürk Blv No:237 D:16, 06680 Çankaya/Ankara',
    u: 'https://share.google/wQg1sf5z5ghW0gSFj',
    pm: 'auto',
    bio: 'Kuğulu Park’ın hemen yanı başında, Tunalı’nın hareketliliğinden sıyrılıp huzurla nefes alabileceğiniz Padam Coffee Shop; işletme sahibesi tarafından günlük taze hazırlanan orijinal İtalyan tatlıları, kurabiyeleri ve nitelikli kahveleriyle butik bir deneyim sunuyor.',
    hr: 'Hafta İçi: 07:30 – 21:00 • Cumartesi: 09:30 – 21:00 • Pazar: 10:00 – 21:00',
    rt: '4.4',
    rc: 349,
    ph: [
      '/images/padam-coffee-shop/1.jpg',
      '/images/padam-coffee-shop/2.jpg',
      '/images/padam-coffee-shop/3.jpg',
      '/images/padam-coffee-shop/4.jpg',
      '/images/padam-coffee-shop/5.jpg',
      '/images/padam-coffee-shop/6.jpg',
    ],
    photos: [
      '/images/padam-coffee-shop/1.jpg',
      '/images/padam-coffee-shop/2.jpg',
      '/images/padam-coffee-shop/3.jpg',
      '/images/padam-coffee-shop/4.jpg',
      '/images/padam-coffee-shop/5.jpg',
      '/images/padam-coffee-shop/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'Nitelikli Latte, Americano & Espresso Bar',
        desc: 'Ankara’nın en beğenilen yumuşak içimli Latte’si, dengeli Americano ve taze çekirdeklerden hazırlanan 3. nesil kahveler.',
        detail: 'İmza Latte • Americano • Taze Kavrum Çekirdek',
      },
      {
        num: '02',
        title: 'Orijinal İtalyan Tarifli Taze Tiramisu',
        desc: 'Gerçek İtalyan reçetesiyle günlük taze hazırlanan, yoğun talep gören ve kısa sürede tükenen imza tiramisu tatlımız.',
        detail: 'Orijinal İtalyan Tarifi • Günlük Taze • İmza Tatlı',
      },
      {
        num: '03',
        title: 'İtalyan Babà Tatlısı & Özel Reçeteler',
        desc: 'İtalyan mutfağına özgü özel şerbetli Babà tatlısı ve başka yerde bulamayacağınız özgün dünya tatlıları.',
        detail: 'Özgün Reçete • Butik Üretim • El Yapımı',
      },
      {
        num: '04',
        title: 'Ev Yapımı Cheesecake & Cookie Çeşitleri',
        desc: 'Her sabah taze fırınlanan tereyağlı kurabiyeler (cookies) ve mevsim meyveli/klasik cheesecake dilimleri.',
        detail: 'Taze Cookie • Cheesecake • Günlük Fırından',
      },
      {
        num: '05',
        title: 'Buzlu Kahveler & Paket Tatlı Siparişi',
        desc: 'Ferahlatıcı soğuk kahveler, al-götür (take-away) servis ve özel günler için dışarıdan tatlı sipariş imkanı.',
        detail: 'Soğuk Kahveler • Paket Tatlı • Hızlı Servis',
      },
      {
        num: '06',
        title: 'Kuğulu Park Yanı Bahçe & Butik Atmosfer',
        desc: 'Kuğulu Park’ın hemen arkasında, sıcak iç dekorasyonu ve keyifli bahçesiyle Tunalı’da huzurlu bir mola noktası.',
        detail: 'Kuğulu Park Yanı • Bahçe Keyfi • Sıcak Atmosfer',
      },
    ],
    reviews: [
      {
        author: 'İlkim Tan',
        role: 'Google Yorumu',
        group: 'Orijinal İtalyan Tiramisu',
        text: 'Yıllardır nefes almaya gittiğim yer. Yiyecekler çok lezzetli ve taze yapılıyor. Özellikle Tiramisu orijinal tarif ile yapılan tam bir İtalyan lezzeti. Kuğulu Parkın yanında oldukça rahatlatıcı bir atmosferi var.',
      },
      {
        author: 'İpek Arya',
        role: 'Google Yorumu',
        group: '3. Nesil Kahve & Ev Yapımı Tatlı',
        text: 'Her ürünü sahibesi tarafından zevkle ve taze taze yapılan, kahveleri oldukça lezzetli olan, içerisi evinizdeymiş hissi yaşatan ve bahçesinde keyifle oturduğumuz 3. nesil kahve ve tatlı dükkanı.',
      },
      {
        author: 'Figen B.',
        role: 'Google Yorumu',
        group: 'Kahve & Kurabiye',
        text: 'Çok güzel bir kahve dükkanı. Hem kahveler hem de kurabiyeler çok iyi. Ortam çok huzurlu, Kuğulu Park’a çok yakın. Mutlaka gidilmeli.',
      },
      {
        author: 'Volkan K.',
        role: 'Google Yorumu',
        group: 'Butik Atmosfer',
        text: 'Mekan sıcak, rahat ve butik bir his veriyor; özellikle Kuğulu Park’a yakın olmasıyla sakin bir kahve ve tatlı molası için ideal.',
      },
    ],
  },
  'f451-brew': {
    n: 'F451 Brew.',
    a: 'Kavaklıdere, John F. Kennedy Cd. No:31 D:C, 06680 Çankaya/Ankara',
    p: '0312 425 83 16',
    c: '3. Nesil Nitelikli Kahve • V60 Demleme • Organik Çekirdek',
    s: 'cafe_dessert',
    q: 'F451 Brew., Kavaklıdere, John F. Kennedy Cd. No:31 D:C, 06680 Çankaya/Ankara',
    u: 'https://share.google/yeX54i5IqjazVb8tu',
    pm: 'auto',
    bio: 'Adını Ray Bradbury’nin ünlü romanı Fahrenheit 451’den alan F451 Brew, Kavaklıdere Kennedy Caddesi’nde taze ve organik nitelikli kahve çekirdeklerini usta demleme teknikleriyle buluşturarak her fincanda benzersiz bir lezzet sunuyor.',
    hr: 'Hafta İçi: 09:00 – 21:00 • Cumartesi: 10:00 – 20:00 • Pazar: 12:00 – 18:00',
    rt: '4.8',
    rc: 52,
    ph: [
      '/images/f451-brew/1.jpg',
      '/images/f451-brew/2.jpg',
      '/images/f451-brew/3.jpg',
      '/images/f451-brew/4.jpg',
      '/images/f451-brew/5.jpg',
      '/images/f451-brew/6.jpg',
    ],
    photos: [
      '/images/f451-brew/1.jpg',
      '/images/f451-brew/2.jpg',
      '/images/f451-brew/3.jpg',
      '/images/f451-brew/4.jpg',
      '/images/f451-brew/5.jpg',
      '/images/f451-brew/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'V60 & 3. Nesil Nitelikli Demleme',
        desc: 'Farklı yörelerin nitelikli kahve çekirdeklerini hassas derece ve demleme teknikleriyle fincanınıza taşıyan manuel demlemeler.',
        detail: 'V60 Pour Over • Hassas Demleme • Zengin Notalar',
      },
      {
        num: '02',
        title: 'Taze & Organik Çekirdek Seçkisi',
        desc: 'Kolombiya ve dünya kahve bölgelerinden özenle seçilen organik, taze kavrulmuş üst segment kahve çekirdekleri.',
        detail: 'Organik Çekirdek • Taze Kavrum • Single Origin',
      },
      {
        num: '03',
        title: 'İmza Americano, Latte & Espresso Bar',
        desc: 'Yüksek gövdeli veya meyvemsi profilleriyle damak zevkinize göre hazırlanan sıcak ve soğuk espresso bazlı kahveler.',
        detail: 'Kolombiya Profili • Usta Barista • Dengeli Krema',
      },
      {
        num: '04',
        title: 'Cheesecake & Kahve Yanı Taze Tatlılar',
        desc: 'Nitelikli kahvenizin aromasını tamamlayan günlük taze cheesecake ve butik tatlı alternatifleri.',
        detail: 'Günlük Taze • Cheesecake • Kahve Eşlikçisi',
      },
      {
        num: '05',
        title: 'Cold Brew & Buzlu Yaz Kahveleri',
        desc: 'Uzun saatler soğuk demlenen Cold Brew ve yaz aylarında bahçe keyfinize eşlik eden buzlu kahveler.',
        detail: 'Soğuk Demleme • Buzlu Latte • Ferah İçim',
      },
      {
        num: '06',
        title: 'Mimari Tasarım Mekan & Hayvan Dostu Atmosfer',
        desc: 'Kennedy Caddesi’nde iç mimarisiyle beğeni toplayan, müzikleri ve hayvan dostu yaklaşımıyla öne çıkan mahalle kahvecisi.',
        detail: 'Özgün İç Mimari • Hayvan Dostu • Kennedy Caddesi',
      },
    ],
    reviews: [
      {
        author: 'Mustafa Volkan Gürbüz',
        role: 'Google Yorumu',
        group: 'Nitelikli Demleme & Barista',
        text: 'Mahallemizin nitelikli kahvecisi. İstediğiniz demleme türünü nitelikli kahvelerle bilen ellerden içeceğiniz çok samimi bir mekan. Güler yüzlü karşılamaları ve açık alanı harika.',
      },
      {
        author: 'Seçil Öztürk',
        role: 'Google Yorumu',
        group: 'Çekirdek Kahve & İç Mimari',
        text: 'Çekirdek kahvede gerçekten gündem yaratan bir mekan. İç mimar olarak mekan tasarımını da çok beğendim. Arkadaşlarımızla çok keyifli vakit geçirdik.',
      },
      {
        author: 'Denizhan Acar',
        role: 'Google Yorumu',
        group: 'Americano & Atmosfer',
        text: 'Ankara’da kahve dendiğinde akla gelecek ilk yerlerden. Kendinizi Kolombiya’da hissetmeniz bir Americano’ya bakıyor. Çok tatlı bir ortam, keyifli insanlar ve güzel müzikler.',
      },
      {
        author: 'N. Akbıyık',
        role: 'Google Yorumu',
        group: 'Kahve Lezzeti',
        text: 'Kahveleri çok lezzetli, çalışanlar ilgili, kibar ve çok tatlılar. Son zamanlarda içtiğim en iyi kahvelerdendi.',
      },
    ],
  },
  'kakule-kahve': {
    n: 'Kakule Kahve',
    a: 'Kavaklıdere, Kızılırmak Cd. No:17, 06680 Çankaya/Ankara',
    p: '0544 477 56 57',
    c: 'Kahve Dükkanı • İmza Tatlılar & Sıcak Mutfak',
    s: 'cafe_dessert',
    q: 'Kakule Kahve, Kavaklıdere, Kızılırmak Cd. No:17, 06680 Çankaya/Ankara',
    u: 'https://share.google/rvifRzpuSxjAxet6F',
    pm: 'auto',
    bio: 'Kavaklıdere Kızılırmak Caddesi’nde 2.200’den fazla misafir değerlendirmesiyle Ankara’nın en sevilen buluşma noktalarından biri olan Kakule Kahve; kavrulmuş fındık soslu imza Rocher tatlısı, meyveli fıstıklı tartı, zengin sıcak mutfağı ve keyifli bahçesiyle hizmet veriyor.',
    hr: 'Her Gün: 09:00 – 23:00',
    rt: '4.3',
    rc: 2295,
    ph: [
      '/images/kakule-kahve/1.jpg',
      '/images/kakule-kahve/2.jpg',
      '/images/kakule-kahve/3.jpg',
      '/images/kakule-kahve/4.jpg',
      '/images/kakule-kahve/5.jpg',
      '/images/kakule-kahve/6.jpg',
    ],
    photos: [
      '/images/kakule-kahve/1.jpg',
      '/images/kakule-kahve/2.jpg',
      '/images/kakule-kahve/3.jpg',
      '/images/kakule-kahve/4.jpg',
      '/images/kakule-kahve/5.jpg',
      '/images/kakule-kahve/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'İmza Rocher Tatlısı (Kavrulmuş Fındık Soslu)',
        desc: 'İçindeki özel kavrulmuş fındık sosu ve Belçika çikolatası katmanlarıyla Kakule Kahve’nin en çok tercih edilen imza tatlısı.',
        detail: 'Kavrulmuş Fındık Sosu • İmza Reçete • Günlük Taze',
      },
      {
        num: '02',
        title: 'Meyveli Fıstıklı Tart & Patisserie Vitrini',
        desc: 'Taze mevsim meyveleri, Antep fıstığı ve özel pastacı kremasıyla günlük hazırlanan tart, cheesecake ve dilim pastalar.',
        detail: 'Meyveli Fıstıklı Tart • Günlük Üretim • Şık Sunum',
      },
      {
        num: '03',
        title: 'Sıcak Mutfak & Doyurucu Yemek Menüsü',
        desc: 'Kahve ve tatlıların yanı sıra gün boyu 5 dakika gibi kısa sürede sıcak servis edilen zengin mutfak ve yemek seçenekleri.',
        detail: 'Zengin Mutfak • Hızlı Servis • Doyurucu Porsiyon',
      },
      {
        num: '04',
        title: 'Nitelikli Sıcak & Buzlu Kahve Çeşitleri',
        desc: 'Espresso, Latte, Iced Latte, Türk kahvesi ve özel aromalı sıcak-soğuk kahve alternatifleri.',
        detail: 'Sıcak & Buzlu Kahveler • Taze Çekirdek • Barista Sunumu',
      },
      {
        num: '05',
        title: 'Taze Demleme Çay & Ev Yapımı İçecekler',
        desc: 'Tatlılarınızın yanında taze demlenen çay, bitki çayları ve ferahlatıcı ev yapımı soğuk içecekler.',
        detail: 'Taze Çay • Doğal İçecekler • Hızlı İkram',
      },
      {
        num: '06',
        title: 'Keyifli Bahçe, Balkon & Samimi İç Mekan',
        desc: 'Kızılırmak Caddesi’nde hem açık bahçe-balkon alanı hem de sıcak iç mekanıyla arkadaş buluşmaları için ideal atmosfer.',
        detail: 'Bahçe & Balkon • Güler Yüzlü Ekip • Kızılırmak Cd.',
      },
    ],
    reviews: [
      {
        author: 'Hamitcan Vural',
        role: 'Google Yorumu',
        group: 'Yemek, Kahve & Hızlı Servis',
        text: 'Çok samimi, çok sıcak; sanki evimde yemek yiyorum ve kahvemi yudumluyorum hissiyatı aldım. Sipariş ettiğimiz her şey yemekler de dahil çok hızlı geldi ve tatları harikaydı.',
      },
      {
        author: 'Neslihan Kamacı',
        role: 'Google Yorumu',
        group: 'Rocher & Meyveli Fıstıklı Tart',
        text: 'Meyveli Fıstıklı Tart ve Rocher siparişi verdik. Rocher tatlısının içindeki kavrulmuş fındık sos gayet güzeldi. Arkadaşlarla vakit geçirmek için çok keyifli bir kafe.',
      },
      {
        author: 'Hafize Hazır',
        role: 'Google Yorumu',
        group: 'Bahçe Atmosferi & Tatlılar',
        text: 'Mekanın atmosferi özellikle bahçe kısmı çok güzel. Kalabalık olmasına rağmen servis hızlı yapıldı, personeller çok güler yüzlü ve tatlıları harikaydı.',
      },
      {
        author: 'Sude K.',
        role: 'Google Yorumu',
        group: 'Mekan & İlgi',
        text: 'Çalışanlar o kadar tatlı ve ilgili ki, mekanın enerjisi ve dekorasyonu da çok güzel. Kavaklıdere’de favori durağımız.',
      },
    ],
  },
  'kanta-coffee-shop': {
    n: 'KANTA Coffee Shop',
    a: 'Yukarı Bahçelievler, 65. Sk. No:4, 06490 Çankaya/Ankara',
    p: '0533 416 17 18',
    c: 'Kahve Dükkanı • Figür Boyama Workshop • Çalışma Alanı',
    s: 'cafe_dessert',
    q: 'KANTA Coffee Shop, Yukarı Bahçelievler, 65. Sk. No:4, 06490 Çankaya/Ankara',
    u: 'https://share.google/Jqu5BDFZjGT1bcUuM',
    pm: 'auto',
    bio: 'Bahçelievler 65. Sokak’ta “Salıncaklı Kahveci” olarak bilinen KANTA Coffee Shop; imza kahveleri (Kantaçino & Berry Love), öncülük ettiği figür boyama workshop etkinlikleri, hayvan dostu bahçesi ve çalışma alanlarıyla genç ve enerjik bir deneyim sunuyor.',
    hr: 'Her Gün: 08:00 – 00:00',
    rt: '4.4',
    rc: 769,
    ph: [
      '/images/kanta-coffee-shop/1.jpg',
      '/images/kanta-coffee-shop/2.jpg',
      '/images/kanta-coffee-shop/3.jpg',
      '/images/kanta-coffee-shop/4.jpg',
      '/images/kanta-coffee-shop/5.jpg',
      '/images/kanta-coffee-shop/6.jpg',
    ],
    photos: [
      '/images/kanta-coffee-shop/1.jpg',
      '/images/kanta-coffee-shop/2.jpg',
      '/images/kanta-coffee-shop/3.jpg',
      '/images/kanta-coffee-shop/4.jpg',
      '/images/kanta-coffee-shop/5.jpg',
      '/images/kanta-coffee-shop/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'İmza Kahveler: Kantaçino & Berry Love',
        desc: 'İşletmemize özel reçetelerle hazırlanan meşhur Kantaçino, Berry Love ve 3. nesil sıcak-soğuk kahve spesiyalleri.',
        detail: 'Kantaçino • Berry Love • Özel Reçete',
      },
      {
        num: '02',
        title: 'Figür Boyama & Sanat Workshop Deneyimi',
        desc: 'Kahvenizi yudumlarken sevdiklerinizle orta ve büyük boy dekoratif figürler boyayabileceğiniz keyifli sanat atölyesi.',
        detail: 'Figür Boyama • Sanat Atölyesi • Tüm Malzemeler Dahil',
      },
      {
        num: '03',
        title: 'Nitelikli Matcha Latte & Soğuk İçecekler',
        desc: 'Tam kıvamında hazırlanan sıcak/buzlu Matcha Latte, Frappe, Cold Brew ve ferahlatıcı ev yapımı içecekler.',
        detail: 'Matcha Latte • Buzlu Kahveler • Doğal Aromalar',
      },
      {
        num: '04',
        title: 'Günlük Taze Tatlılar & Sandviç Çeşitleri',
        desc: 'Çalışma ve sohbet molalarınıza eşlik eden taze vitrin tatlıları, pastalar ve doyurucu sandviç alternatifleri.',
        detail: 'Günlük Taze Tatlı • Sandviçler • Özenli Sunum',
      },
      {
        num: '05',
        title: 'Özel Sunumlu Bitki Çayları & Sıcak İçecekler',
        desc: 'Farklı bitki ve meyve harmanlarıyla hazırlanan şık sunumlu kış çayları ve taze demleme çay.',
        detail: 'Şık Sunum • Doğal Harman • Sıcak İkram',
      },
      {
        num: '06',
        title: 'Salıncaklı Bahçe & Geniş Çalışma Alanı',
        desc: 'Konforlu koltukları, salıncaklı bahçesi, hayvan dostu yaklaşımı ve geniş ders/ofis çalışma katıyla Bahçelievler’in buluşma noktası.',
        detail: 'Salıncaklı Bahçe • Hayvan Dostu • Çalışma Katı',
      },
    ],
    reviews: [
      {
        author: 'Fatih Metehan Keser',
        role: 'Google Yorumu',
        group: 'Kantaçino & Figür Workshop',
        text: 'Öncülük yaptığı workshop hizmeti ile öne çıkan çok başarılı bir kafe. Bizi güler yüzlü çalışanlar karşıladı. Kantaçino kahvesi ve figür boyama aktivitesi günün sonunda kesinlikle değecek harika bir deneyimdi.',
      },
      {
        author: 'Ayşegül Baykal',
        role: 'Google Yorumu',
        group: 'Berry Love & Hayvan Dostu Mekan',
        text: 'Hayvan dostu işletmesi ve genç ruhuyla Kanta Bahçeli’ye gelme sebebidir. Üniversite yıllarımdan beri tercih ettiğim Berry Love kahvesi ve taze tatlılarıyla kalitesinden hiçbir şey kaybetmiyor.',
      },
      {
        author: 'Gezme Sanatı',
        role: 'Google Yorumu',
        group: 'Bitki Çayı & Sandviç',
        text: 'Ortam çok sıcak ve şirindi. Bitki çayı içtik, sunumu çok güzeldi. Ayrıca taze tatlı ve sandviç çeşitleri de oldukça başarılı.',
      },
      {
        author: 'Aslı K.',
        role: 'Google Yorumu',
        group: 'Matcha & Çalışma Alanı',
        text: 'Matchası çok güzel, ders çalışmak ve arkadaşlarla vakit geçirmek için müdavimi olduğumuz konforlu bir mekan.',
      },
    ],
  },
  'kvassir': {
    n: 'Kvassir',
    a: 'Emek, Bişkek Cd. 25/A, 06510 Çankaya/Ankara',
    p: '0530 583 71 23',
    c: '3. Nesil Dünya Kahveleri • Tatlılar & Çikolatalar • Sandviçler',
    s: 'cafe_dessert',
    q: 'Kvassir, Emek, Bişkek Cd. 25/A, 06510 Çankaya/Ankara',
    u: 'https://share.google/f1vzGtG0AXf88dLCB',
    pm: 'auto',
    bio: 'Emek Bişkek Caddesi’nde (8. Cadde) işletme sahibinin el çizimi özgün sanat eserleriyle bezeli atmosferinde hizmet veren Kvassir; 3. nesil dünya kahveleri, el yapımı çikolataları, taze tatlıları ve dört mevsim keyifli bahçesiyle misafirlerini ağırlıyor.',
    hr: 'Her Gün: 09:00 – 00:00',
    rt: '4.4',
    rc: 251,
    ph: [
      '/images/kvassir/1.jpg',
      '/images/kvassir/2.jpg',
      '/images/kvassir/3.jpg',
      '/images/kvassir/4.jpg',
      '/images/kvassir/5.jpg',
      '/images/kvassir/6.jpg',
    ],
    photos: [
      '/images/kvassir/1.jpg',
      '/images/kvassir/2.jpg',
      '/images/kvassir/3.jpg',
      '/images/kvassir/4.jpg',
      '/images/kvassir/5.jpg',
      '/images/kvassir/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: '3. Nesil Dünya Kahveleri & Espresso Bar',
        desc: 'Taze kavrulmuş seçkin çekirdeklerden hazırlanan dünya kahveleri, Americano, Latte ve aromatik espresso çeşitleri.',
        detail: 'Dünya Kahveleri • Taze Kavrum • Usta Barista',
      },
      {
        num: '02',
        title: 'El Yapımı Çikolatalar & Sıcak Brownie',
        desc: 'Şık sunumuyla servis edilen yoğun Belçika çikolatalı brownie ve el yapımı butik çikolata çeşitlerimiz.',
        detail: 'El Yapımı Çikolata • Sıcak Brownie • Şık Sunum',
      },
      {
        num: '03',
        title: 'San Sebastian & Günlük Taze Tatlılar',
        desc: 'Kahve keyfinize eşlik eden günlük taze San Sebastian cheesecake, tart ve patisserie lezzetleri.',
        detail: 'San Sebastian • Günlük Üretim • Taze Malzeme',
      },
      {
        num: '04',
        title: 'Gurme Sandviçler & Atıştırmalıklar',
        desc: 'Günün her saati taze ekmek ve doğal malzemelerle hazırlanan doyurucu sandviç alternatifleri.',
        detail: 'Taze Sandviç • Günlük Hazırlık • Doyurucu Öğün',
      },
      {
        num: '05',
        title: 'Kış Bitki Çayları & Yazlık Soğuk Çaylar',
        desc: 'Kış aylarında içinizi ısıtan doğal bitki çayları, yaz aylarında ise ferahlatan ev yapımı soğuk çay ve kahveler.',
        detail: 'Mevsimsel İçecekler • Bitki Çayları • Ferahlatıcı Soğuk Çay',
      },
      {
        num: '06',
        title: 'Sanat Eserleriyle Bezeli Butik Atmosfer',
        desc: 'Her köşesi el çizimi özgün sanat eserleriyle tasarlanmış, dört mevsim keyif veren iç mekan ve bahçe alanı.',
        detail: 'Özgün Sanat Tasarımı • Dört Mevsim Bahçe • Emek 8. Cadde',
      },
    ],
    reviews: [
      {
        author: 'Meliha Akın',
        role: 'Google Yorumu',
        group: 'Sanatsal Atmosfer & Kahve',
        text: 'İçerideki harika sanat eserleri ve her mevsimin keyfini yaşatan tasarımıyla emek emek kurulmuş butik, tatlı bir kahveci. Kışın bitki çayları, yazın soğuk çayları ve kahveleri çok lezzetli. Çalışanları her zaman güler yüzlü ve ilgili.',
      },
      {
        author: 'Burak T.',
        role: 'Google Yorumu',
        group: 'Brownie & Çay',
        text: 'Brownie servisi sade ve çok şıktı, çayı ve kahveleri her zaman taze. Emek Bişkek Caddesi’nde oturup dinlenmek için çok keyifli bir nokta.',
      },
      {
        author: 'Esra K.',
        role: 'Google Yorumu',
        group: 'Dünya Kahveleri',
        text: 'Ortamı çok keyifli, servis son derece nazik ve güler yüzlü. Dekorasyonu ve müzikleriyle kendine has bir ruhu var.',
      },
      {
        author: 'Caner D.',
        role: 'Google Yorumu',
        group: '3. Nesil Kahve & Tatlı',
        text: 'Arkadaşlarla buluşup kahve ve tatlı eşliğinde sohbet etmek için Emek bölgesindeki en estetik mekanlardan biri.',
      },
    ],
  },
  'guzu-coffee': {
    n: 'Guzu Coffee',
    a: 'Barbaros, Bülten Sk. No:26, 06680 Çankaya/Ankara',
    p: '0544 477 56 57',
    c: '3. Nesil Kahve • Ev Yapımı Tatlı & Tuzlu Atıştırmalıklar',
    s: 'cafe_dessert',
    q: 'Guzu Coffee, Barbaros, Bülten Sk. No:26, 06680 Çankaya/Ankara',
    u: 'https://share.google/PzXELt41ofI6i5luV',
    pm: 'auto',
    bio: 'Tunalı Bülten Sokak’ta kartpostal güzelliğindeki ışıl ışıl iç mekanı, kitap okumak ve çalışmak için özenle seçilmiş dingin müzikleri, nitelikli kahveleri ve ev yapımı tuzlu-tatlı lezzetleriyle huzurlu bir kahve deneyimi sunuyoruz.',
    hr: 'Hafta İçi: 10:00 – 23:00 • Cumartesi: 11:00 – 23:00 • Pazar: 11:00 – 22:00',
    rt: '4.5',
    rc: 133,
    ph: [
      '/images/guzu-coffee/1.jpg',
      '/images/guzu-coffee/2.jpg',
      '/images/guzu-coffee/3.jpg',
      '/images/guzu-coffee/4.jpg',
      '/images/guzu-coffee/5.jpg',
      '/images/guzu-coffee/6.jpg',
    ],
    photos: [
      '/images/guzu-coffee/1.jpg',
      '/images/guzu-coffee/2.jpg',
      '/images/guzu-coffee/3.jpg',
      '/images/guzu-coffee/4.jpg',
      '/images/guzu-coffee/5.jpg',
      '/images/guzu-coffee/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'Nitelikli Espresso & Taze Demleme Kahveler',
        desc: 'Özenle seçilen kahve çekirdeklerinden hazırlanan Latte, Cappuccino, Americano ve taze filtre kahve çeşitleri.',
        detail: 'Taze Çekirdek • Dengeli İçim • Sıcak & Soğuk',
      },
      {
        num: '02',
        title: 'Ev Yapımı Tuzlu Atıştırmalıklar & Kişler',
        desc: 'Günlük taze malzemelerle kendi mutfağımızda hazırlanan ev yapımı tuzlu atıştırmalıklar ve fırın lezzetleri.',
        detail: 'Ev Yapımı • Günlük Taze • Doğal İçerik',
      },
      {
        num: '03',
        title: 'Günlük Taze Kek, Kurabiye & Tatlılar',
        desc: 'Kahvenizin yanında keyifle tüketebileceğiniz günlük taze kek, kurabiye ve butik tatlı seçenekleri.',
        detail: 'Günlük Üretim • Taze Sunum • Butik Tatlılar',
      },
      {
        num: '04',
        title: 'Soğuk Kahveler & Ferahlatıcı İçecekler',
        desc: 'Bülten Sokak molalarınıza ferahlık katan Iced Latte, Cold Brew ve ev yapımı soğuk içecekler.',
        detail: 'Buzlu Kahveler • Ferahlatıcı • Yaz Menüsü',
      },
      {
        num: '05',
        title: 'Taze Demleme Çay & Bitki Çayları',
        desc: 'Kahve dışı alternatif arayan misafirlerimiz için taze demleme çay ve doğal bitki çayı çeşitleri.',
        detail: 'Taze Çay • Bitki Çayları • Nazik Servis',
      },
      {
        num: '06',
        title: 'Kitap Okuma & Çalışma Dostu Huzurlu Mekan',
        desc: 'Işıl ışıl iç mekan tasarımı ve dingin müzikleriyle kitap okumak, ders çalışmak ve dinlenmek için ideal atmosfer.',
        detail: 'Huzurlu İç Mekan • Çalışma Dostu • Bülten Sokak',
      },
    ],
    reviews: [
      {
        author: 'Pınar Yaşar Şatıroğlu',
        role: 'Google Yorumu',
        group: 'Kahve & Huzurlu İç Mekan',
        text: 'Kahveleri çok lezzetli ve kaliteli. İç mekan kartpostal gibi ışıl ışıl, samimi ve huzurlu. Müzikleri kitap okumak ve ders çalışmak için mükemmel. Çalışanlar oldukça nazik ve tatlılar.',
      },
      {
        author: 'Esra Eser',
        role: 'Google Yorumu',
        group: 'Ev Yapımı Tuzlu Atıştırmalıklar',
        text: 'Çalışanları çok tatlı ve güler yüzlü. Ev yapımı tuzlu atıştırmalıklarının tadı bayağı iyiydi, içeriğini de özenle anlattılar. Gönül rahatlığıyla tercih edebilirsiniz.',
      },
      {
        author: 'Mert Y.',
        role: 'Google Yorumu',
        group: 'Bülten Sokak Kahve Molası',
        text: 'Tunalı Bülten Sokak’ta sakinliği ve estetik dekorasyonuyla öne çıkan çok hoş bir butik kahveci.',
      },
      {
        author: 'Zeynep K.',
        role: 'Google Yorumu',
        group: 'Kahve & Müzik',
        text: 'Hem kahveleri hem de içeride çalan müzik listesi harika. Kitabınızı alıp saatlerce huzurla oturabileceğiniz bir yer.',
      },
    ],
  },
  'grandala-coffee': {
    n: 'Grandala Coffee',
    a: 'Remzi Oğuz Arık Mah., Bestekar Cd. No:35/D, 06540 Çankaya/Ankara',
    p: '0544 477 56 57',
    c: '3. Nesil Nitelikli Kahve • V60 Demleme • Butik Kafe',
    s: 'cafe_dessert',
    q: 'Grandala Coffee, Remzi Oğuz Arık, Bestekar Cd 35/D, 06540 Çankaya/Ankara',
    u: 'https://share.google/pVeufxAgu9ytLPUsP',
    pm: 'auto',
    bio: 'Bestekar Caddesi’nde “Coffee or not coffee” mottosuyla hizmet veren Grandala Coffee; meyvemsi ve dengeli nitelikli çekirdekleriyle hazırladığı V60 demlemeleri, bol kremalı Americano’su, taze tatlıları ve dergi köşeli sıcak iç-dış mekanıyla öne çıkıyor.',
    hr: 'Hafta İçi & Pazar: 09:30 – 23:30 • Cumartesi: 09:30 – 00:00',
    rt: '4.6',
    rc: 339,
    ph: [
      '/images/grandala-coffee/1.jpg',
      '/images/grandala-coffee/2.jpg',
      '/images/grandala-coffee/3.jpg',
      '/images/grandala-coffee/4.jpg',
      '/images/grandala-coffee/5.jpg',
      '/images/grandala-coffee/6.jpg',
    ],
    photos: [
      '/images/grandala-coffee/1.jpg',
      '/images/grandala-coffee/2.jpg',
      '/images/grandala-coffee/3.jpg',
      '/images/grandala-coffee/4.jpg',
      '/images/grandala-coffee/5.jpg',
      '/images/grandala-coffee/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'V60 Nitelikli Demleme & Çekirdek Seçkisi',
        desc: 'Damak tadınıza göre meyvemsi veya dengeli gövdeli çekirdek önerileriyle barista tarafından özenle demlenen V60 kahveler.',
        detail: 'V60 Demleme • Barista Çekirdek Önerisi • Nitelikli Kahve',
      },
      {
        num: '02',
        title: 'Kremalı Americano, Latte & Espresso Bar',
        desc: 'Üzerinde yoğun kremasıyla fark yaratan Americano, ipeksi süt köpüklü Latte, Cappuccino ve Flat White.',
        detail: 'Kremalı Americano • Latte Art • Taze Öğütüm',
      },
      {
        num: '03',
        title: 'Geleneksel Türk Kahvesi & Sıcak İçecekler',
        desc: 'Yemek sonrası veya sohbet molalarınız için özenle pişirilen bol köpüklü Türk kahvesi ve taze demleme çay.',
        detail: 'Türk Kahvesi • Taze Demleme Çay • Şık Sunum',
      },
      {
        num: '04',
        title: 'Günlük Taze Alman Pastası & Tatlılar',
        desc: 'Kahve ve çayınızın yanına çok yakışan taze Alman pastası, cheesecake ve günlük vitrin tatlıları.',
        detail: 'Alman Pastası • Günlük Taze • Hafif Tatlılar',
      },
      {
        num: '05',
        title: 'Soğuk Kahveler & Ferahlatıcı İçecekler',
        desc: 'Bestekar Caddesi’nde açık havada keyifle yudumlayabileceğiniz Iced Latte, Iced Americano ve soğuk demlemeler.',
        detail: 'Buzlu Kahveler • Cold Brew • Ferah İçim',
      },
      {
        num: '06',
        title: 'Dergi Köşeli Konforlu İç & Dış Mekan',
        desc: 'Rahat koltukları, incelenebilecek kültür-sanat dergileri ve hem iç hem dış oturma alanıyla Bestekar’ın en samimi kafesi.',
        detail: 'İç & Dış Mekan • Dergi Köşesi • Bestekar Caddesi',
      },
    ],
    reviews: [
      {
        author: 'Mehmet Fatih Setdibi',
        role: 'Google Yorumu',
        group: 'V60 Demleme & Barista İlgisi',
        text: 'Bestekar’ın en samimi kafelerinden biri. V60 denedim ve gayet güzeldi; çalışanların ilgisi ve kahveyi beğenip beğenmediğimi sormaları da çok şık bir hareket.',
      },
      {
        author: 'Mert Erboyacı',
        role: 'Google Yorumu',
        group: 'Meyvemsi V60 Çekirdek Seçimi',
        text: 'Meyvemsi ve dengeli gövdeli bir çekirdek önermesini rica ettim baristaya ve seçtiği kahveyi V60 olarak deneyimledim. Çok güzel ve dengeli bir kahveydi, çalışanlar çok güler yüzlü.',
      },
      {
        author: 'Güzellik & Sağlık',
        role: 'Google Yorumu',
        group: 'Alman Pastası & Çay',
        text: 'Alman pastası ve çay aldım, çok taze ve lezzetliydi. Hem iç hem dış mekanın olması çok iyi, personeller son derece kibar.',
      },
      {
        author: 'Persassy J.',
        role: 'Google Yorumu',
        group: 'Atmosfer & Kahve Çekirdekleri',
        text: 'Kahve çekirdekleri ile dikkat çeken, ortamı ve atmosferi sıcacık bir mekan. İçerideki koltuklar çok rahat, incelenecek dergiler konulmuş, çalışanlar çok kibar.',
      },
    ],
  },
  'caffenux': {
    n: 'CaffeNux',
    a: 'Güvenevler, Kıbrıs Sk. No:13, 06105 Çankaya/Ankara',
    p: '0530 977 09 58',
    c: 'Butik Kahve Dükkanı • San Sebastian Cheesecake & Tatlılar',
    s: 'cafe_dessert',
    q: 'CaffeNux, Güvenevler, Kıbrıs Sk. No:13, 06105 Çankaya/Ankara',
    u: 'https://share.google/4ylp4CKLJgUhlzcHx',
    pm: 'auto',
    bio: 'Aşağı Ayrancı Güvenevler Kıbrıs Sokak’ta tam bir mahalle kafesi sıcaklığıyla hizmet veren CaffeNux; efsanevi San Sebastian Cheesecake’i, lezzetli kahveleri, esintili sokak oturma alanı ve güler yüzlü ekibiyle keyifli bir mola sunuyor.',
    hr: 'Hafta İçi: 10:00 – 22:30 • Hafta Sonu: 10:30 – 22:30',
    rt: '4.6',
    rc: 446,
    ph: [
      '/images/caffenux/1.jpg',
      '/images/caffenux/2.jpg',
      '/images/caffenux/3.jpg',
      '/images/caffenux/4.jpg',
      '/images/caffenux/5.jpg',
      '/images/caffenux/6.jpg',
    ],
    photos: [
      '/images/caffenux/1.jpg',
      '/images/caffenux/2.jpg',
      '/images/caffenux/3.jpg',
      '/images/caffenux/4.jpg',
      '/images/caffenux/5.jpg',
      '/images/caffenux/6.jpg',
    ],
    items: [
      {
        num: '01',
        title: 'İmza San Sebastian Cheesecake',
        desc: 'Tam kıvamında akışkan dokusu ve taze sunumuyla müdavimlerinin favorisi olan meşhur San Sebastian Cheesecake.',
        detail: 'İmza San Sebastian • Akışkan Kıvam • Günlük Taze',
      },
      {
        num: '02',
        title: 'Nitelikli Espresso, Latte & Filtre Kahve',
        desc: 'Gün boyu taze öğütülen çekirdeklerle hazırlanan Latte, Americano, Cappuccino ve filtre kahve çeşitleri.',
        detail: 'Taze Öğütüm • Sıcak & Soğuk • Dengeli Lezzet',
      },
      {
        num: '03',
        title: 'Buzlu Kahveler & Yazlık Ferah İçecekler',
        desc: 'Kıbrıs Sokak’ın esintili yaz akşamlarında ferahlık veren Iced Latte, Iced Americano ve soğuk içecekler.',
        detail: 'Buzlu Kahve • Ferahlatıcı • Yaz Akşamı Keyfi',
      },
      {
        num: '04',
        title: 'Günlük Butik Tatlılar & Kahve Eşlikçileri',
        desc: 'Kahvenizin yanında taze olarak sunulan kurabiye, kek ve günlük vitrin tatlıları.',
        detail: 'Günlük Vitrin • Taze Tatlılar • Özenli Sunum',
      },
      {
        num: '05',
        title: 'Al-Götür (Take-Away) & Hızlı Kahve Servisi',
        desc: 'Yol üstü kahve molalarınız ve yürüyüşleriniz için pratik, hızlı ve sıcak-soğuk take-away kahve servisi.',
        detail: 'Hızlı Take-Away • Pratik Sunum • Gün Boyu Taze',
      },
      {
        num: '06',
        title: 'Kıbrıs Sokak Açık Hava & Mahalle Kafesi',
        desc: 'Park yeri bulmanın kolay olduğu, esintili sokak oturma alanı ve samimi komşuluk havasıyla Güvenevler’in mahalle kafesi.',
        detail: 'Mahalle Kafesi • Açık Hava Oturma • Kıbrıs Sokak',
      },
    ],
    reviews: [
      {
        author: 'Açelya Şebboy Çelik',
        role: 'Google Yorumu',
        group: 'San Sebastian & Kahve',
        text: 'Kahveler çok lezzetli, mekanın yeri harika. Özellikle yaz akşamlarında çok keyifli oluyor. Çalışanlar inanılmaz kibar ve ilgili. Özellikle San Sebastian’ı efsane, bir kafede ne ararsanız var 10/10.',
      },
      {
        author: 'Can Tonbul',
        role: 'Google Yorumu',
        group: 'Mahalle Kafesi Atmosferi',
        text: 'Tam bir mahalle kafesi. Yolumun üzerinde görüp oturdum, iyi ki de oturmuşum. Atmosferi çok tatlı, sıcak yaz günlerinde oturması şahane keyifli, çalışanlar çok kibar. Mutlaka tavsiye ediyorum!',
      },
      {
        author: 'Elif M.',
        role: 'Google Yorumu',
        group: 'Kahve & Güler Yüzlü Hizmet',
        text: 'Kıbrıs Sokak’ın en samimi ve huzurlu noktası. Hem kahveleri hem de tatlıları her zaman taze.',
      },
      {
        author: 'Burak S.',
        role: 'Google Yorumu',
        group: 'Kıbrıs Sokak Mola Noktası',
        text: 'Arkadaşlarla akşamüstü kahve içip sohbet etmek için her hafta uğradığımız çok nezih bir işletme.',
      },
    ],
  },
};

const ANKARA_ROOT_SITE: DynamicSiteInfo = {
  n: 'Ankara Kurumsal İşletme & Hizmet Merkezi',
  a: 'Çankaya / Ankara',
  p: '0544 477 56 57',
  c: 'Kurumsal Hizmet • Danışmanlık • Profesyonel Uygulama',
  s: 'corporate_editorial',
  q: 'Çankaya, Ankara',
};

function getCleanPathSlug(): string {
  try {
    const raw = decodeURIComponent(window.location.pathname || '')
      .replace(/^\/+|\/+$/g, '')
      .toLowerCase();
    if (!raw || raw === 'index.html' || raw.startsWith('api/')) return '';
    return raw;
  } catch {
    return '';
  }
}

function decodeSiteParam(slug: string): DynamicSiteInfo | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('s');
    if (s) {
      const base64 = s.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '==='.slice((base64.length + 3) % 4);
      const binary = atob(padded);
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      const jsonStr = new TextDecoder('utf-8').decode(bytes);
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.n) {
        if (slug) {
          try {
            sessionStorage.setItem(`site_slug_${slug}`, JSON.stringify(parsed));
          } catch {}
          // Automatically strip the long ?s=... query parameter from the browser address bar!
          try {
            window.history.replaceState({}, '', `/${slug}`);
          } catch {}
        }
        return parsed as DynamicSiteInfo;
      }
    }

    if (slug) {
      if (SEED_SITES_CLIENT[slug]) {
        return SEED_SITES_CLIENT[slug];
      }
      try {
        const cached = sessionStorage.getItem(`site_slug_${slug}`);
        if (cached) {
          const parsedCached = JSON.parse(cached);
          if (parsedCached && parsedCached.n) {
            return parsedCached as DynamicSiteInfo;
          }
        }
      } catch {}
    }
  } catch (e) {
    console.error('Parametre cozumleme hatasi:', e);
  }
  return null;
}

export function App() {
  const slug = useMemo(() => getCleanPathSlug(), []);
  const initialInfo = useMemo(() => decodeSiteParam(slug), [slug]);
  const [resolvedInfo, setResolvedInfo] = useState<DynamicSiteInfo | null>(initialInfo);
  const [loadingSlug, setLoadingSlug] = useState<boolean>(Boolean(slug && !initialInfo));

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetch(
      `/api/telegram?slug=${encodeURIComponent(slug)}&host=${encodeURIComponent(
        window.location.hostname || ''
      )}`
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.ok && data?.info && data.info.n) {
          try {
            sessionStorage.setItem(`site_slug_${slug}`, JSON.stringify(data.info));
          } catch {}
          setResolvedInfo((prev) => ({
            ...(prev || {}),
            ...data.info,
          }));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setLoadingSlug(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (resolvedInfo) {
    return <DynamicCorporateSite info={resolvedInfo} />;
  }

  if (loadingSlug && slug) {
    const displayTitle = slug
      .split('-')
      .map((w) => w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1))
      .join(' ');
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-5" />
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {displayTitle}
        </h1>
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-400 mt-2">
          Kurumsal Web Sitesi Yükleniyor
        </p>
      </div>
    );
  }

  // If visiting the root domain of ankara-web-siteleri.vercel.app directly, never show Samsun Volkswagen!
  if (
    typeof window !== 'undefined' &&
    window.location.hostname.toLowerCase().includes('ankara')
  ) {
    return <DynamicCorporateSite info={ANKARA_ROOT_SITE} />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-sky-500 selection:text-slate-950 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <AboutWorkshop />
        <Services />
        <ReviewRiver />
        <WorkshopGallery />
        <ContactSection />
      </main>
      <Footer />
      <MobileQuickBar />
    </div>
  );
}

export default App;
