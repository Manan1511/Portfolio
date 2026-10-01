// Furniture uses the character's 120px logical grid. The keyboard meets hands
// at (83, 74), and the table legs meet the shared floor at y=114.
export function DeskFurniture() {
  return <>
    <svg className="scene-prop scene-desk" viewBox="0 0 120 120" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="#6e4933" d="M64 84H68V114H64ZM111 84H115V114H111Z" />
      <path fill="#8f6340" d="M111 86H113V112H111Z" />
      <path fill="#553c2f" d="M64 111H68V114H64ZM111 111H115V114H111Z" />
      <path fill="#bf8c58" d="M55 74H113V76H115V78H117V80H119V83H61V81H59V79H57V77H55Z" />
      <path fill="#dab57b" d="M55 74H113V76H57V77H55ZM59 79H117V80H61V81H59Z" />
    </svg>
    <svg className="scene-prop scene-laptop" viewBox="0 0 120 120" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="#304447" d="M84 52H112V73H81V56H84Z" />
      <path fill="#4d6667" d="M86 54H110V70H84V58H86Z" />
      <path fill="#a4cfc0" d="M87 56H108V68H86V60H87Z" />
      <path fill="#dde7c9" d="M89 58H91V60H89ZM94 61H105V63H94ZM90 65H103V66H90Z" />
      <path fill="#23383b" d="M81 71H112V75H80Z" />
      <path fill="#304447" d="M81 73H112V75H110V77H108V79H106V82H69V80H71V78H73V76H77V74H81Z" />
      <path fill="#718784" d="M81 74H110V76H108V78H106V80H71V78H75V76H79V75H81Z" />
      <path fill="#405b5d" d="M80 75H103V76H80ZM77 77H104V78H77Z" />
      <path fill="#9cae9f" d="M80 79H89V80H80Z" />
      <path fill="#faf0d1" d="M112 68H116V78H112ZM116 70H119V75H116V73H117V72H116Z" />
      <path fill="#886850" d="M112 68H116V70H112Z" />
      <path fill="#d3cfad" d="M112 77H116V78H112Z" />
    </svg>
    {/* The apron sits in front of the lap, below the animated hands. */}
    <svg className="scene-prop scene-desk-front" viewBox="0 0 120 120" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="#6e4933" d="M61 83H119V86H61Z" />
      <path fill="#8f6340" d="M61 83H119V84H61Z" />
      <path fill="#553c2f" d="M61 85H119V86H61Z" />
    </svg>
  </>;
}
