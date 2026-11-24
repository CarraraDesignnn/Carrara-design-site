/* v6: CGI craft in the blurb and highlights, shorter commission stories.
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
    blurb:"A hyper-resolution CGI rendering of the first GT3 RS to bring the Manthey Kit into Porsche’s Sonderwunsch program, recreated down to the last stitch and carbon fiber weave. Geyser Grey Metallic over wine-red tinted carbon, with a Bordeaux and Creme cabin.",
    story:{
      title:"Motorsport Meets Art",
      body:[
        "In 2024, James Serafino asked us to lead the creative direction for a 992 GT3 RS with both Paint to Sample and Sonderwunsch designations. Specified with Porsche’s Sonderwunsch team and Manthey Racing in Meuspath, it became the first car to bring the Manthey Kit into the Sonderwunsch process."
      ],
      photos:[
        {src:"/img/manthey-hero2.jpg",alt:"The finished GT3 RS with doors open"},
        {src:"/img/manthey-r-seat.jpg",alt:"Creme seat with classic pattern insert"}
      ],
      link:"/work/manthey-gt3-rs/"
    },
    car:[["Exterior","Paint to Sample Geyser Grey Metallic"],["Carbon","Wine-red tint, factory and Manthey aero"],["Interior","Two-tone Bordeaux and Creme leather"],["Program","Sonderwunsch × Manthey Racing"]]
  },
  "serafino-gt2rs":{
    size:"30 × 40 in",
    blurb:"A hyper-resolution CGI rendering of a 2019 GT2 RS in Urban Bamboo Chromaflair, Porsche’s color-shifting paint, recreated down to the last stitch and carbon fiber weave. White Gold Metallic accents over a bespoke Chalk and Agate Grey cabin.",
    story:{
      title:"A Color With Many Personalities",
      body:[
        "In 2018, James Serafino was offered Urban Bamboo Chromaflair and asked us to design the car around it. Every accent had to work as the paint shifts between green, gold and grey. Delivered in 2019, it now sits at the Porsche Experience Center Atlanta."
      ],
      photos:[
        {src:"/img/gt2rs-real-interior.jpg",alt:"The finished GT2 RS interior"},
        {src:"/img/gt2rs-real-sill.jpg",alt:"Illuminated GT2 RS Sonderwunsch sill plate"}
      ],
      link:"/work/urban-bamboo-gt2-rs/"
    },
    car:[["Exterior","Urban Bamboo Chromaflair"],["Wheels","White Gold Metallic"],["Interior","Chalk and Agate Grey, Pepita inserts"],["Program","Paint to Sample · Sonderwunsch"]]
  }
};
/* current Shopify handles */
window.PRINTS["manthey-gt3-rs-the-serafino-collection"]=window.PRINTS["serafino-gt3rs-framed-print"];
window.PRINTS["chromaflair-gt2-rs-the-serafino-collection"]=window.PRINTS["serafino-gt2rs"];
