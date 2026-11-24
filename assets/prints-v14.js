/* v14: plainer Family Portrait copy. v13: removed the framed-print links that duplicated the commission cards. v12: Family Portrait is available in December only (not a unit cap). v11: Family Portrait 20x30 print, per-product fine print and edition text. v10: transition line above the commission card. v9: print-only highlights, blurb names the car. v8: thin commission card, video above Made by Hand, no render-to-reality cards.
   Print detail content, keyed by Shopify product handle.
   Edit text here; price, stock and photos still come from Shopify. */
window.PRINT_HIGHLIGHTS=[
  "Hyper-resolution fine automotive CGI, every texture recreated down to the last stitch and carbon fiber weave",
  "Hand-stained solid wood box frame with a specialist wax finish that brings out the natural grain and warmth of the wood",
  "20mm on the front face and 33mm deep from the wall, for a clean, contemporary shadow-line look",
  "Museum-quality Giclée print",
  "Delivered fully assembled",
  "Hangs from a cobra hook"
];
window.PRINTS={
  "serafino-gt3rs-framed-print":{
    size:"30 × 40 in",
    blurb:"Framed print of James’ 911 GT3 RS in Geyser Grey Metallic with the Manthey Kit, one of the Serafino Collection cars specified with him. Every option was chosen in collaboration, and the print shows the finished specification.",
    highlights:[
      "30 × 40 in fine art giclée print, limited to 10",
      "Solid wood box frame in black, hand-stained and wax finished",
      "20 mm front face, 33 mm from the wall",
      "Perspex acrylic glaze",
      "Delivered fully assembled"
    ],
    madeByHand:{
      paras:[
        "Every print starts as a hyper-resolution render, built by our team from the same specification file we used to design the car. The detail goes down to the last stitch and the carbon fiber weave."
      ],
      video:{
        mp4:"/img/p/manthey/blender-build.mp4",
        mov:"/img/p/manthey/blender-build.mov",
        poster:"/img/p/manthey/blender-build-poster.jpg",
        alt:"The GT3 RS render being built in the Blender viewport"
      }
    },
    story:{
      transition:"Both prints show real cars we specified for clients. This GT3 RS is one of the Serafino Collection cars we worked on with James, built with Porsche’s Sonderwunsch team and Manthey Racing.",
      image:"/img/manthey-hero2.jpg",
      link:"/work/manthey-gt3-rs/"
    }
  },
  "serafino-gt2rs":{
    size:"30 × 40 in",
    blurb:"Framed print of James’ 911 GT2 RS in Urban Bamboo Chromaflair, one of the Serafino Collection cars we designed with him. The specification was built together, option by option, and this print shows the car exactly as it was specified.",
    highlights:[
      "30 × 40 in fine art giclée print, limited to 10",
      "Solid wood box frame in black, hand-stained and wax finished",
      "20 mm front face, 33 mm from the wall",
      "Perspex acrylic glaze",
      "Delivered fully assembled"
    ],
    madeByHand:{
      paras:[
        "Every print starts as a hyper-resolution render, built by our team from the same specification file we used to design the car. The detail goes down to individual stitches in the leather and the weave of the carbon fiber."
      ],
      video:{
        mp4:"/img/p/gt2rs/blender-build.mp4",
        mov:"/img/p/gt2rs/blender-build.mov",
        poster:"/img/p/gt2rs/blender-build-poster.jpg",
        alt:"The GT2 RS render being built in the Blender viewport"
      }
    },
    story:{
      transition:"Both prints show real cars we specified for clients. This GT2 RS is one of the Serafino Collection cars we designed with James, built around the Urban Bamboo Chromaflair paint.",
      image:"/img/gt2rs-real-front.jpg",
      link:"/work/urban-bamboo-gt2-rs/"
    }
  },
  "family-portrait-the-serafino-collection":{
    size:"20 × 30 in",
    format:"Unframed print",
    editionText:"Available in December only",
    editionSpec:"Available to order in December only. Never printed again after December.",
    fine:"Available to order in December only. Never printed again after that.",
    blurb:"Both Serafino Collection cars in one group photo: James’ 911 GT2 RS and 911 GT3 RS. Built from the same specification files as the framed prints.",
    highlights:[
      "20 × 30 in fine art giclée print, unframed",
      "Natural white 200gsm enhanced matte art paper",
      "Smooth texture with a matte finish that removes glare",
      "Ships rolled in a protective tube"
    ],
    madeByHand:{
      paras:[
        "The same hyper-resolution render as the framed prints, with both cars in one group photo."
      ],
      image:{
        src:"/img/p/family/duo-bts-1600.jpg",
        alt:"The GT2 RS and GT3 RS group render"
      }
    },
    story:{},
    transition:"Both cars are real, and we specified each one with James. This print shows them together.",
    commissions:[
      {image:"/img/gt2rs-real-front.jpg",link:"/work/urban-bamboo-gt2-rs/",kicker:"Urban Bamboo Chromaflair",title:"The 911 GT2 RS commission"},
      {image:"/img/manthey-hero2.jpg",link:"/work/manthey-gt3-rs/",kicker:"Geyser Grey Metallic with Manthey Kit",title:"The 911 GT3 RS commission"}
    ]
  }
};
/* current Shopify handles */
window.PRINTS["manthey-gt3-rs-the-serafino-collection"]=window.PRINTS["serafino-gt3rs-framed-print"];
window.PRINTS["chromaflair-gt2-rs-the-serafino-collection"]=window.PRINTS["serafino-gt2rs"];
