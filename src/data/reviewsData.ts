export interface ReviewItem {
  id: number;
  author: string;
  role: string;
  avatarText: string;
  rating: number;
  productGroup: string;
  content: string;
  highlight: string;
}

export const reviewsList: ReviewItem[] = [
  {
    id: 1,
    author: 'Murat Kaya',
    role: 'Google Yorumu • Samsun',
    avatarText: 'MK',
    rating: 5,
    productGroup: 'Dijital Takograf Kalibrasyon',
    content:
      'Çekici aracımızın dijital takograf muayene ve kalibrasyon işlemi için İlkadım Sanayi Sitesi’ndeki Bektaş Oto’ya geldik. Bekletmeden çok hızlı ve nizami şekilde kalibrasyonu yapıp belgemizi teslim ettiler.',
    highlight: 'Dijital Takograf Servisi',
  },
  {
    id: 2,
    author: 'Hasan Öztürk',
    role: 'Google Yorumu • Tekkeköy',
    avatarText: 'HÖ',
    rating: 5,
    productGroup: 'Şarj & Marş Dinamosu Onarımı',
    content:
      'Sabah aracım marş basmadı, şarj dinamosu arızasını aynı gün içinde söküp kömür ve konjektör bakımını yaparak sıfır ayarında teslim ettiler. İşinin ehli, dürüst esnaf.',
    highlight: 'Marş & Şarj Dinamosu',
  },
  {
    id: 3,
    author: 'İsmail Çelik',
    role: 'Google Yorumu • Samsun',
    avatarText: 'İÇ',
    rating: 5,
    productGroup: 'Akü Değişimi & Kaçak Kontrolü',
    content:
      'Aracımda elektrik kaçağı vardı ve aküyü bitiriyordu. Cihazla ölçüm yapıp kaçağın kaynağını kısa sürede buldular, yeni garantili akümüzü de uygun fiyata taktılar.',
    highlight: 'Akü & Kaçak Tespiti',
  },
  {
    id: 4,
    author: 'Cengiz Yılmaz',
    role: 'Google Yorumu • Çarşamba',
    avatarText: 'CY',
    rating: 5,
    productGroup: 'Ticari Araç Takograf & Elektrik',
    content:
      'Nakliye filomuzdaki kamyon ve tırların hem takograf işlemlerini hem de tüm elektrik tesisat bakımlarını yıllardır Bektaş Oto’da yaptırıyoruz. Samsun’da bu işin en güvenilir adresidir.',
    highlight: 'Ağır Vasıta & Ticari Elektrik',
  },
  {
    id: 5,
    author: 'Kadir Demir',
    role: 'Google Yorumu • Samsun',
    avatarText: 'KD',
    rating: 5,
    productGroup: 'Taksimetre & Elektronik Teşhis',
    content:
      'Taksimetre ayarı ve araç içi aydınlatma/tesisat arızası için uğradım. Güler yüzlü karşılama, temiz işçilik ve hızlı çözüm için tüm ustalara teşekkür ederim.',
    highlight: 'Taksimetre & Oto Elektronik',
  },
  {
    id: 6,
    author: 'Sinan Aksoy',
    role: 'Google Yorumu • Ordu',
    avatarText: 'SA',
    rating: 5,
    productGroup: 'Bilgisayarlı Elektrik Arıza Tespiti',
    content:
      'Samsun Tekkeköy sanayisinde oto elektrik ve takograf konusunda tek geçerim. Gereksiz parça değiştirmeden arızayı nokta atışı bulup tamir ediyorlar.',
    highlight: 'Garantili Oto Elektrik',
  },
];
