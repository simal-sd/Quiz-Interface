export const quizData = [
  {
    id: 1,
    question: "Which of these small, seemingly harmless items must be treated as E-Waste?",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    options: [
      { text: "A purely mechanical wind-up toy", isCorrect: false },
      { text: "A paper musical greeting card that plays a tune", isCorrect: true },
      { text: "An empty plastic printer ink cartridge", isCorrect: false },
      { text: "A stack of old polaroid photographs", isCorrect: false }
    ],
    explanation: "It's easy to miss! E-waste includes absolutely anything with a battery or circuit board. That musical greeting card has a tiny microchip, speaker, and a lithium battery hidden inside the paper."
  },
  {
    id: 2,
    question: "You have loose AA batteries and an old phone with a 'spicy pillow' (a dangerously swollen battery). What is the proper way to handle them?",
    image: "https://vonikoshop.com/cdn/shop/articles/2_e569c7fd-67de-411b-9ae4-0cea22b11dc0_1200x1200_crop_center.png?v=1770300544",
    options: [
      { text: "Put them in a sealed glass jar in the refrigerator to reduce swelling.", isCorrect: false },
      { text: "Puncture the swollen battery to release the built-up gas before recycling.", isCorrect: false },
      { text: "Keep them at room temperature and put clear tape over the contact points.", isCorrect: true },
      { text: "Toss them into a plastic bag alongside your mixed paper and plastic recyclables.", isCorrect: false }
    ],
    explanation: "Never puncture a swollen battery—it can cause a literal explosion or fire! Refrigeration is a myth. The best method is keeping them at room temperature in a dry place, and taping the terminals (ends) to prevent accidental sparking."
  },
  {
    id: 3,
    question: "Where is the absolute BEST place for us to set up the E-Waste Collection Point?",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    options: [
      { text: "A dark, unused corner in the basement", isCorrect: false },
      { text: "On the stairway landing leading up to the terrace", isCorrect: false },
      { text: "A well-lit, highly visible common area (like the main lobby and cafeteria)", isCorrect: true },
      { text: "Next to the outdoor dumpster so it's out of the way", isCorrect: false }
    ],
    explanation: "Collection points must be highly visible, well-lit, and easily accessible. Placing them on stairways creates a serious fire and tripping hazard, and hiding them in basements means people simply won't use them!"
  },
  {
    id: 4,
    question: "Before handing over your old smartphone, what is the MOST reliable way to protect your personal data?",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
    options: [
      { text: "Manually delete all your photos and log out of your email apps.", isCorrect: false },
      { text: "Perform a complete system factory reset to encrypt and wipe the memory.", isCorrect: true },
      { text: "Smash the screen so nobody can turn the device on.", isCorrect: false },
      { text: "Remove the SIM card; that's where all the photos are stored.", isCorrect: false }
    ],
    explanation: "Manually deleting files or removing the SIM card doesn't actually remove data from the phone's internal hard drive. A full factory reset is required to properly wipe and encrypt your personal information."
  },
  {
    id: 5,
    question: "You have a giant tangled ball of mysterious chargers and cables. What's the best way to drop them off?",
    image: "https://www.shutterstock.com/image-photo/multicolored-wires-tangled-wiring-on-260nw-2486595511.jpg",
    options: [
      { text: "Leave them tangled; the industrial recycling shredders will chop them up anyway.", isCorrect: false },
      { text: "Strip the plastic casing off the wires yourself to save the recyclers time.", isCorrect: false },
      { text: "Only bring the cables if you are also dropping off the exact device they belong to.", isCorrect: false },
      { text: "Coil them individually and secure them with a tie so they can be easily sorted.", isCorrect: true }
    ],
    explanation: "While shredders exist, many cables are manually sorted first by type (copper, USB, etc.). Tangled nests slow down the workers significantly. Also, never strip wires yourself—it's dangerous and unnecessary!"
  },
  {
    id: 6,
    question: "You've got a broken wired computer mouse and a frayed USB charging cable. Do these count as E-Waste?",
    image: "https://i.pcmag.com/imagery/articles/04VkxlYhQzYOmrvrQkGBPKk-7.fit_lim.size_1200x630.v1631545423.jpg",
    options: [
      { text: "No, only devices with screens or batteries count.", isCorrect: false },
      { text: "Yes! Anything that conducts electricity, transmits data, or plugs in counts.", isCorrect: true },
      { text: "Only the mouse counts; cables go in the regular trash.", isCorrect: false },
      { text: "No, they are considered 'mixed plastics' and go in the standard recycling.", isCorrect: false }
    ],
    explanation: "E-waste isn't just screens and smart devices! 'Peripherals' like keyboards, mice, chargers, USB cords, and even string lights contain valuable copper wire and components that need to be diverted from landfills."
  },
  {
    id: 7,
    question: "Your old laptop was run over by a car and is now in three shattered pieces. How should it be handled?",
    image: "https://3.imimg.com/data3/CN/TX/MY-3438412/broken-laptop-reworking.jpg",
    options: [
      { text: "Throw it in the regular trash; destroyed electronics are no longer useful to recyclers.", isCorrect: false },
      { text: "It must be rejected; once damaged, the exposed components classify it as hazardous waste.", isCorrect: false },
      { text: "Bring it in! The true value is in extracting the raw precious metals, regardless of condition.", isCorrect: true },
      { text: "Tape the pieces tightly back together before dropping it off so it looks like a laptop.", isCorrect: false }
    ],
    explanation: "Bring it in! While refurbishing is ideal, recycling facilities physically shred and melt down old devices to extract precious metals like gold, silver, copper, and palladium. The physical condition doesn't matter for raw material recovery."
  },
  {
    id: 8,
    question: "Which of these everyday household items is actually 'invisible e-waste' and completely ruins standard recycling batches?",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800",
    options: [
      { text: "A standard manual plastic toothbrush", isCorrect: false },
      { text: "An electric toothbrush with a built-in battery", isCorrect: true },
      { text: "A reusable, gel-based chemical hand warmer", isCorrect: false },
      { text: "An old, purely mechanical kitchen egg timer", isCorrect: false }
    ],
    explanation: "Electric toothbrushes are a common form of 'invisible e-waste'. Because they are used in the bathroom and often look like regular plastic items, people mistakenly throw them in the regular trash or plastic recycling, but they contain batteries and circuit boards!"
  }
];
