import type { LegalSection, Localized, Service, Step, FaqItem } from "@/lib/types";

export const services: Service[] = [
  {
    id: "full-service",
    number: "01",
    icon: "wrench",
    title: {
      hu: "Teljeskörű kerékpár szervizelés",
      en: "Full bicycle servicing",
      de: "Kompletter Fahrradservice",
    },
    description: {
      hu: "Átvizsgáljuk az egész bringát, beállítjuk a váltókat, féket és csapágyakat, és rendbe tesszük, ami kopott.",
      en: "We go through the whole bike, set up shifting, brakes and bearings, and put right whatever has worn out.",
      de: "Wir prüfen das ganze Rad, stellen Schaltung, Bremsen und Lager ein und bringen in Ordnung, was verschlissen ist.",
    },
    points: {
      hu: ["Teljes átvizsgálás és beállítás", "Kopott alkatrészek cseréje egyeztetve"],
      en: ["Full inspection and setup", "Worn parts replaced after agreement"],
      de: ["Komplette Prüfung und Einstellung", "Verschleißteile nach Absprache"],
    },
  },
  {
    id: "custom-build",
    number: "02",
    icon: "bike",
    title: {
      hu: "Egyedi kerékpárok építése garanciával",
      en: "Custom bicycle builds with warranty",
      de: "Individuelle Aufbauten mit Garantie",
    },
    description: {
      hu: "A geometriától az alkatrészlistán át a színekig. Olyan gépet építünk, ami tényleg a tiéd.",
      en: "From geometry to the parts list to the colours. We build a machine that is genuinely yours.",
      de: "Von der Geometrie über die Teileliste bis zu den Farben. Wir bauen eine Maschine, die wirklich Ihre ist.",
    },
    points: {
      hu: ["Személyre szabott geometria és felszereltség", "Garanciával átadott, komplett építés"],
      en: ["Personal geometry and specification", "Complete build handed over with warranty"],
      de: ["Individuelle Geometrie und Ausstattung", "Kompletter Aufbau mit Garantie"],
    },
  },
  {
    id: "wheels",
    number: "03",
    icon: "wheel",
    title: {
      hu: "Egyedi kerekek építése",
      en: "Custom wheel building",
      de: "Individueller Laufradbau",
    },
    description: {
      hu: "Kézzel font kerekek a te súlyodra, terepedre és tempódra. Megfelelő feszesség, tartós illesztések.",
      en: "Hand-built wheels for your weight, terrain and pace. Proper tension, durable builds.",
      de: "Handgebaute Laufräder für Ihr Gewicht, Ihr Gelände und Ihr Tempo. Richtige Spannung, haltbare Aufbauten.",
    },
    points: {
      hu: ["Kézi fűzés, egyedi agy–persely kombinációk", "Utólagos feszesség-ellenőrzés"],
      en: ["Hand lacing, custom hub and rim pairings", "Follow-up tension check"],
      de: ["Handgespeicht, individuelle Naben-Felgen-Kombinationen", "Spannungskontrolle im Anschluss"],
    },
  },
  {
    id: "protection",
    number: "04",
    icon: "sparkles",
    title: {
      hu: "Védőfóliázás, waxolás",
      en: "Protective film & waxing",
      de: "Schutzfolie & Wachsen",
    },
    description: {
      hu: "Védjük a vázat a kavicsoktól és karcolásoktól, a láncot pedig tiszta, száraz waxolással kezeljük.",
      en: "We protect the frame from stones and scratches, and treat the chain with a clean, dry wax finish.",
      de: "Wir schützen den Rahmen vor Steinen und Kratzern und behandeln die Kette mit einem sauberen, trockenen Wachs.",
    },
    points: {
      hu: ["Átlátszó védőfólia a kritikus pontokra", "Lánc- és vázkezelés, szezonális felkészítés"],
      en: ["Clear protective film on contact points", "Chain and frame care, seasonal prep"],
      de: ["Transparente Schutzfolie an Kontaktstellen", "Ketten- und Rahmenpflege, Saisonvorbereitung"],
    },
  },
  {
    id: "loan-bike",
    number: "05",
    icon: "repeat",
    title: {
      hu: "Csere kerékpár a szerviz idejére",
      en: "Loan bike during service",
      de: "Leihrad während der Reparatur",
    },
    description: {
      hu: "Nem kell lemondanod a tekerésről, míg a bringád a műhelyben van. Kérj csere bringát előre.",
      en: "You don't have to stop riding while your bike is with us. Ask for a loan bike in advance.",
      de: "Sie müssen nicht aufs Fahren verzichten, während Ihr Rad bei uns ist. Fragen Sie vorab nach einem Leihrad.",
    },
    points: {
      hu: ["Előzetes egyeztetéssel", "A szerviz idejére biztosított használat"],
      en: ["By prior arrangement", "Available for the duration of the service"],
      de: ["Nach vorheriger Absprache", "Für die Dauer des Service verfügbar"],
    },
  },
  {
    id: "used-bikes",
    number: "06",
    icon: "badge",
    title: {
      hu: "Garanciális használt kerékpárok értékesítése",
      en: "Warranty used-bike sales",
      de: "Gebrauchte Fahrräder mit Garantie",
    },
    description: {
      hu: "Átvizsgált, beállított használt bringák garanciával — jó belépő, ha most kezdenél.",
      en: "Inspected, set-up used bikes with warranty — a good start if you're just getting into riding.",
      de: "Geprüfte, eingestellte Gebrauchträder mit Garantie — ein guter Einstieg, wenn Sie gerade beginnen.",
    },
    points: {
      hu: ["Átvizsgált és beállított állapot", "Garanciális feltételek átadáskor"],
      en: ["Inspected and adjusted condition", "Warranty terms at handover"],
      de: ["Geprüfter und eingestellter Zustand", "Garantiebedingungen bei Übergabe"],
    },
  },
  {
    id: "shipping",
    number: "07",
    icon: "package",
    title: {
      hu: "Kerékpárok postázása világszerte",
      en: "Worldwide bicycle shipping",
      de: "Weltweiter Fahrradversand",
    },
    description: {
      hu: "Ha messze laksz, gondosan csomagoljuk és útnak indítjuk a bringát. Európán belül és azon túl is.",
      en: "If you live far away, we pack the bike carefully and send it on its way. Within Europe and beyond.",
      de: "Wenn Sie weiter weg wohnen, verpacken wir das Rad sorgfältig und schicken es auf die Reise. In Europa und darüber hinaus.",
    },
    points: {
      hu: ["Biztonságos csomagolás", "Követhető szállítás egyeztetett módon"],
      en: ["Safe, careful packing", "Tracked shipping arranged with you"],
      de: ["Sichere, sorgfältige Verpackung", "Nachverfolgter Versand nach Absprache"],
    },
  },
];

export const processSteps: Step[] = [
  {
    number: "01",
    title: { hu: "Beszélgetés", en: "Conversation", de: "Gespräch" },
    text: {
      hu: "Megismerjük az utaid, a méreteidet és a kereted. Nincs sablon, nincs találgatás.",
      en: "We learn about your roads, your measurements and your budget. No templates, no guessing.",
      de: "Wir lernen Ihre Straßen, Ihre Maße und Ihr Budget kennen. Keine Schablonen, kein Raten.",
    },
  },
  {
    number: "02",
    title: { hu: "Tervezés", en: "Design", de: "Planung" },
    text: {
      hu: "Kiválasztjuk az alkatrészeket, egyeztetjük a geometriát és átlátható költségeket adunk.",
      en: "We choose the parts, agree the geometry and give you clear, transparent costs.",
      de: "Wir wählen die Teile, stimmen die Geometrie ab und nennen transparente Kosten.",
    },
  },
  {
    number: "03",
    title: { hu: "Építés", en: "Build", de: "Aufbau" },
    text: {
      hu: "Kézzel fűzzük a kerekeket, összeállítjuk és milliméterre beállítjuk a gépet.",
      en: "We lace the wheels by hand, assemble the bike and set it up to the millimetre.",
      de: "Wir speichen die Laufräder von Hand, montieren das Rad und stellen es millimetergenau ein.",
    },
  },
  {
    number: "04",
    title: { hu: "Tekerés", en: "Ride", de: "Fahrt" },
    text: {
      hu: "Próba, finomhangolás, átadás. Utána pedig szerviz, amikor csak kell.",
      en: "Test ride, fine-tuning, handover. And servicing whenever you need it after that.",
      de: "Testfahrt, Feintuning, Übergabe. Und danach Service, wann immer Sie ihn brauchen.",
    },
  },
];

export const faqItems: FaqItem[] = [
  {
    question: {
      hu: "Hogyan kérhetek időpontot?",
      en: "How do I book a slot?",
      de: "Wie vereinbare ich einen Termin?",
    },
    answer: {
      hu: "A leggyorsabb, ha felhívsz minket a +36 30 688 3723 számon. Írhatsz e-mailt is, de telefonon azonnal egyeztetjük az időpontot.",
      en: "The quickest way is to call us on +36 30 688 3723. You can email too, but on the phone we can confirm a slot straight away.",
      de: "Am schnellsten rufen Sie uns unter +36 30 688 3723 an. Sie können auch mailen, aber am Telefon bestätigen wir den Termin direkt.",
    },
  },
  {
    question: {
      hu: "Mennyi ideig tart egy szerviz?",
      en: "How long does a service take?",
      de: "Wie lange dauert ein Service?",
    },
    answer: {
      hu: "A bringa állapotától és az alkatrészek elérhetőségétől függ. Telefonon a valós átfutást mondjuk meg, nem ígérünk légből kapott határidőt.",
      en: "It depends on the condition of the bike and parts availability. We give you a realistic turnaround on the phone instead of guessing.",
      de: "Das hängt vom Zustand des Rads und der Teileverfügbarkeit ab. Am Telefon nennen wir eine realistische Dauer statt luftiger Versprechen.",
    },
  },
  {
    question: {
      hu: "Vállaltok egyedi építést vidékről vagy külföldről?",
      en: "Do you take custom builds from outside Pécs or abroad?",
      de: "Übernehmen Sie individuelle Aufbauten von außerhalb oder aus dem Ausland?",
    },
    answer: {
      hu: "Igen. Az egyeztetés történhet online, az átadás pedig személyesen vagy postázással. A részleteket az ajánlatban rögzítjük.",
      en: "Yes. We can plan remotely and hand over in person or by shipping. We set out the details in the quote.",
      de: "Ja. Die Planung kann online erfolgen, die Übergabe persönlich oder per Versand. Details halten wir im Angebot fest.",
    },
  },
  {
    question: {
      hu: "Van garancia az egyedi építésre?",
      en: "Is there a warranty on a custom build?",
      de: "Gibt es Garantie auf einen individuellen Aufbau?",
    },
    answer: {
      hu: "Igen. A garancia pontos feltételeit az ajánlatban és az átadáskor írásban rögzítjük, hogy minden világos legyen.",
      en: "Yes. The exact warranty terms are set out in writing in the quote and at handover so everything is clear.",
      de: "Ja. Die genauen Garantiebedingungen halten wir im Angebot und bei der Übergabe schriftlich fest.",
    },
  },
  {
    question: {
      hu: "Tudtok segíteni a méretválasztásban?",
      en: "Can you help with sizing?",
      de: "Helfen Sie bei der Größenwahl?",
    },
    answer: {
      hu: "Igen. A geometria és az ülésállás beállítása az építés része. Ha már van bringád, a meglévő pozíciódból is tudunk indulni.",
      en: "Yes. Geometry and contact-point setup are part of the build. If you already ride, we can start from your current position.",
      de: "Ja. Geometrie und Kontaktpunkte gehören zum Aufbau. Wenn Sie bereits fahren, können wir von Ihrer aktuellen Position ausgehen.",
    },
  },
  {
    question: {
      hu: "Milyen típusú kerékpárokkal foglalkoztok?",
      en: "What kinds of bikes do you work on?",
      de: "Mit welchen Fahrrädern arbeiten Sie?",
    },
    answer: {
      hu: "A leggyakoribb szabványokkal: városi, országúti, gravel és MTB. Ha különleges vagy régi darabod van, hívj minket, és megmondjuk, mit tudunk vállalni.",
      en: "The common standards: city, road, gravel and MTB. If you have something unusual or vintage, call us and we'll tell you what we can do.",
      de: "Die gängigen Standards: City, Rennrad, Gravel und MTB. Bei etwas Ungewöhnlichem oder Vintage rufen Sie an — wir sagen Ihnen, was möglich ist.",
    },
  },
];

export const legalSections: LegalSection[] = [
  {
    heading: {
      hu: "Adatkezelő",
      en: "Data controller",
      de: "Verantwortlicher",
    },
    body: {
      hu: [
        "Dreamline Cycle, 7625 Pécs, Hegyalja u. 20., Magyarország.",
        "E-mail: dreamlinecycle@gmail.com · Telefon: +36 30 688 3723.",
      ],
      en: [
        "Dreamline Cycle, Hegyalja u. 20., 7625 Pécs, Hungary.",
        "Email: dreamlinecycle@gmail.com · Phone: +36 30 688 3723.",
      ],
      de: [
        "Dreamline Cycle, Hegyalja u. 20., 7625 Pécs, Ungarn.",
        "E-Mail: dreamlinecycle@gmail.com · Telefon: +36 30 688 3723.",
      ],
    },
  },
  {
    heading: {
      hu: "Kezelt adatok",
      en: "Data we process",
      de: "Verarbeitete Daten",
    },
    body: {
      hu: [
        "A weboldal böngészése során a tárhelyszolgáltató szervernaplói kezelhetik az IP-címet, a böngésző típusát, az operációs rendszert és a látogatás időpontját. Ezek az adatok a biztonságos üzemeltetést szolgálják.",
        "Kapcsolatfelvételkor a név, e-mail cím, telefonszám és az üzenet tartalma kerül feldolgozásra, kizárólag a megkeresés megválaszolásáig.",
      ],
      en: [
        "When you browse the site, the hosting provider's server logs may process your IP address, browser type, operating system and visit time. This data is used for secure operation.",
        "When you get in touch, we process your name, email address, phone number and message content, solely to answer your enquiry.",
      ],
      de: [
        "Beim Besuch der Website können die Server-Logs des Hosting-Anbieters IP-Adresse, Browsertyp, Betriebssystem und Besuchszeit verarbeiten. Diese Daten dienen dem sicheren Betrieb.",
        "Bei einer Kontaktaufnahme verarbeiten wir Name, E-Mail-Adresse, Telefonnummer und Nachrichteninhalt ausschließlich zur Beantwortung Ihrer Anfrage.",
      ],
    },
  },
  {
    heading: {
      hu: "Analitika és sütik",
      en: "Analytics & cookies",
      de: "Analyse & Cookies",
    },
    body: {
      hu: [
        "A weboldal alapvető működéséhez szükséges sütiket használunk. Analitikai sütiket (Google Analytics 4) csak a hozzájárulásod után töltünk be; addig semmilyen mérés nem fut.",
        "A hozzájárulást bármikor módosíthatod vagy visszavonhatod a lábléc „Sütibeállítások” hivatkozásán. A Google Analytics adatkezeléséről a Google saját tájékoztatója ad részleteket.",
      ],
      en: [
        "We use cookies that are essential for the site to function. Analytics cookies (Google Analytics 4) are only loaded after you consent; until then, no measurement runs.",
        "You can change or withdraw consent at any time via the “Cookie settings” link in the footer. Google's own policy explains how Google Analytics processes data.",
      ],
      de: [
        "Wir verwenden Cookies, die für den Betrieb der Website erforderlich sind. Analyse-Cookies (Google Analytics 4) laden wir erst nach Ihrer Zustimmung; bis dahin läuft keine Messung.",
        "Sie können Ihre Zustimmung jederzeit über den Link „Cookie-Einstellungen“ im Footer ändern oder widerrufen. Googles eigene Richtlinie erläutert die Datenverarbeitung von Google Analytics.",
      ],
    },
  },
  {
    heading: {
      hu: "Kapcsolatfelvétel",
      en: "Contact form",
      de: "Kontaktformular",
    },
    body: {
      hu: [
        "Az űrlap elküldésekor a megadott adatokat a választott űrlapszolgáltató továbbítja e-mailben a műhelynek. Az adatokat kizárólag a megkeresés megválaszolására használjuk.",
        "Az űrlap használata önkéntes. Telefonon és e-mailben is felveheted velünk a kapcsolatot.",
      ],
      en: [
        "When you submit the form, the chosen form provider forwards the details to the workshop by email. We use the data only to answer your enquiry.",
        "Using the form is voluntary. You can also reach us by phone or email.",
      ],
      de: [
        "Beim Absenden des Formulars leitet der gewählte Formularanbieter die Angaben per E-Mail an die Werkstatt weiter. Wir nutzen die Daten ausschließlich zur Beantwortung Ihrer Anfrage.",
        "Die Nutzung des Formulars ist freiwillig. Sie erreichen uns auch telefonisch oder per E-Mail.",
      ],
    },
  },
  {
    heading: {
      hu: "Jogaid",
      en: "Your rights",
      de: "Ihre Rechte",
    },
    body: {
      hu: [
        "Kérheted az adataidhoz való hozzáférést, azok helyesbítését, törlését, a feldolgozás korlátozását, valamint tiltakozhatsz a feldolgozás ellen. Kérésedet a dreamlinecycle@gmail.com címen jelezheted.",
        "Panasszal a Nemzeti Adatvédelmi és Információszabadság Hatósághoz (NAIH, 1055 Budapest, Falk Miksa utca 9-11., naih.hu) fordulhatsz.",
      ],
      en: [
        "You may request access to, correction or deletion of your data, restriction of processing, and you may object to processing. Send requests to dreamlinecycle@gmail.com.",
        "You can complain to the Hungarian National Authority for Data Protection and Freedom of Information (NAIH, Falk Miksa utca 9-11., 1055 Budapest, naih.hu).",
      ],
      de: [
        "Sie können Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung sowie Widerspruch geltend machen. Anfragen an dreamlinecycle@gmail.com.",
        "Beschwerden können Sie an die ungarische Datenschutzbehörde NAIH (Falk Miksa utca 9-11., 1055 Budapest, naih.hu) richten.",
      ],
    },
  },
  {
    heading: {
      hu: "Tárhely és biztonság",
      en: "Hosting & security",
      de: "Hosting & Sicherheit",
    },
    body: {
      hu: [
        "A weboldal statikusan, CDN-en keresztül kerül kiszolgálásra. A tárhelyszolgáltató a szervernaplókat saját adatvédelmi szabályzata szerint kezeli.",
        "Az oldal HTTPS-en keresztül érhető el. A kapcsolatfelvételi adatokat biztonságos csatornán továbbítjuk.",
      ],
      en: [
        "The website is served statically via a CDN. The hosting provider handles server logs under its own privacy policy.",
        "The site is available over HTTPS. Contact details are transmitted over a secure channel.",
      ],
      de: [
        "Die Website wird statisch über ein CDN ausgeliefert. Der Hosting-Anbieter verarbeitet Server-Logs nach seiner eigenen Datenschutzrichtlinie.",
        "Die Website ist über HTTPS erreichbar. Kontaktdaten werden über einen sicheren Kanal übertragen.",
      ],
    },
  },
  {
    heading: {
      hu: "Impresszum",
      en: "Imprint",
      de: "Impressum",
    },
    body: {
      hu: [
        "Üzemeltető: Dreamline Cycle · 7625 Pécs, Hegyalja u. 20. · Magyarország.",
        "Kapcsolat: dreamlinecycle@gmail.com · +36 30 688 3723.",
        "A weboldal tartalma szerzői jogi védelem alatt áll. Az oldalon található információk tájékoztató jellegűek; a szolgáltatások részleteit minden esetben egyeztetés rögzíti.",
      ],
      en: [
        "Operator: Dreamline Cycle · Hegyalja u. 20., 7625 Pécs, Hungary.",
        "Contact: dreamlinecycle@gmail.com · +36 30 688 3723.",
        "The content of this website is protected by copyright. Information on the site is for guidance only; the details of every service are agreed in writing.",
      ],
      de: [
        "Betreiber: Dreamline Cycle · Hegyalja u. 20., 7625 Pécs, Ungarn.",
        "Kontakt: dreamlinecycle@gmail.com · +36 30 688 3723.",
        "Die Inhalte dieser Website sind urheberrechtlich geschützt. Die Angaben auf der Seite dienen der Orientierung; die Details jeder Leistung werden schriftlich vereinbart.",
      ],
    },
  },
];
