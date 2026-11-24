/* v10: transition line above the commission card. v9: print-only highlights, blurb names the car. v8: thin commission card, video above Made by Hand, no render-to-reality cards.
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
  }
};
/* current Shopify handles */
window.PRINTS["manthey-gt3-rs-the-serafino-collection"]=window.PRINTS["serafino-gt3rs-framed-print"];
window.PRINTS["chromaflair-gt2-rs-the-serafino-collection"]=window.PRINTS["serafino-gt2rs"];
