const grass = Array.from({ length: 145 }, (_, index) => ({
  x: (index * 47 + 13) % 480,
  y: 204 + (index * 29) % 116,
})).filter(({ x, y }) => !(x > 169 && x < 319 && y > 217 && y < 277));

export function PixelLandscape() {
  return <svg className="pixel-landscape" viewBox="0 0 480 320" preserveAspectRatio="xMidYMid slice" aria-hidden="true" shapeRendering="crispEdges">
    <defs>
      <g id="pixel-cloud"><path fill="#f8f7df" d="M0 9H6V5H12V2H24V0H36V4H43V9H50V16H0Z" /><path fill="#c9ddd9" d="M0 14H50V17H0Z" /></g>
      <g id="pixel-tree">
        <path fill="#866645" d="M16 38H23V55H16Z" /><path fill="#b2925e" d="M17 41H20V54H17Z" />
        <path fill="#547b50" d="M8 6H14V0H26V6H32V12H38V32H32V39H7V33H1V13H8Z" />
        <path fill="#739a59" d="M9 8H15V3H25V8H31V15H35V26H29V32H7V27H4V15H9Z" />
        <path fill="#90af68" d="M14 7H24V12H29V18H9V13H14Z" />
        <path fill="#466c49" d="M5 28H12V32H31V36H7V32H3V26H5Z" />
        <path fill="#a3bd75" d="M14 10H18V13H14ZM7 18H10V22H7Z" />
      </g>
    </defs>
    <path fill="#d2e7e3" d="M0 0H480V320H0Z" />
    <use href="#pixel-cloud" x="45" y="52" />
    <use href="#pixel-cloud" x="358" y="39" />
    <use href="#pixel-cloud" x="188" y="21" transform="translate(54 6) scale(.8)" />
    <path fill="#bbd5bc" d="M0 172H20V164H43V157H75V149H107V155H133V164H158V176H195V182H290V176H321V164H344V154H373V150H403V160H436V173H480V211H0Z" />
    <path fill="#a4c18d" d="M0 191H54V182H97V177H121V181H148V188H177V198H294V191H322V179H356V174H398V183H427V192H480V221H0Z" />
    <path fill="#94b875" d="M0 198H480V320H0Z" />
    <path fill="#a0be7e" d="M0 200H480V213H0Z" />
    <path fill="#bed090" d="M201 219H277V224H298V231H313V244H322V269H305V278H289V283H190V278H177V267H167V242H178V231H190V224H201Z" />
    <path fill="#c8d799" d="M203 223H276V228H295V235H309V247H316V266H303V274H285V278H194V273H180V262H173V245H184V235H194V228H203Z" />
    {grass.map(({ x, y }, i) => <path key={i} fill={i % 3 === 0 ? '#afc887' : '#81a965'} d={`M${x} ${y}h2v-2h1v3h2v1h-5Z`} />)}
    <use href="#pixel-tree" x="13" y="161" /><use href="#pixel-tree" x="55" y="170" />
    <use href="#pixel-tree" x="425" y="161" /><use href="#pixel-tree" x="462" y="177" />
    <use href="#pixel-tree" x="98" y="203" /><use href="#pixel-tree" x="365" y="209" />
    <path fill="#e9e1ac" d="M150 278h2v-2h2v2h2v2h-2v2h-2v-2h-2ZM334 252h2v-2h2v2h2v2h-2v2h-2v-2h-2ZM90 263h2v-2h2v2h2v2h-2v2h-2v-2h-2Z" />
    <path fill="#cd8e70" d="M151 278h3v3h-3ZM335 252h3v3h-3ZM91 263h3v3h-3Z" />
  </svg>;
}
