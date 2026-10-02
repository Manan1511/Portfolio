import { pixelPath, scenePixelSize } from '../shared/pixelGrid';

// All props share the character's 120px layout and one three-quarter perspective.
// The keyboard meets hands at (83, 74); the seat supports hips around y=88.
// Props stay behind the complete character frame, including the table edge.
export function DeskFurniture({ scale }: { scale: number }) {
  const density = Math.max(1, Math.round(scale)) / scenePixelSize;
  const grid = 120 * density;
  const viewBox = `0 0 ${grid} ${grid}`;
  const path = (drawing: string) => pixelPath(drawing, density);
  return <>
    <svg className="scene-prop scene-chair" viewBox={viewBox} aria-hidden="true" shapeRendering="crispEdges">
      <path fill="#283c38" d={path('M30 50H37V52H40V84H43V89H32V86H30Z')} />
      <path fill="#477061" d={path('M32 53H37V84H34V86H32Z')} />
      <path fill="#23362f" d={path('M33 86H59V89H62V92H35V90H33ZM43 92H47V112H43ZM34 112H57V114H34Z')} />
      <path fill="#5d8570" d={path('M35 86H59V89H35Z')} />
      <path fill="#477061" d={path('M44 94H46V111H44Z')} />
    </svg>
    <svg className="scene-prop scene-desk" viewBox={viewBox} aria-hidden="true" shapeRendering="crispEdges">
      <path fill="#553c2f" d={path('M115 76H118V109H115ZM72 85H75V112H72Z')} />
      <path fill="#6e4933" d={path('M108 84H112V114H108Z')} />
      <path fill="#8f6340" d={path('M108 86H110V112H108Z')} />
      <path fill="#553c2f" d={path('M108 112H112V114H108Z')} />
      <path fill="#bf8c58" d={path('M78 71H120V73H118V75H116V78H114V81H112V83H69V81H71V79H73V77H75V74H78Z')} />
      <path fill="#dab57b" d={path('M78 71H120V72H79V74H77V77H75V79H73V81H71V82H69V81H71V79H73V77H75V74H78Z')} />
      <path fill="#6e4933" d={path('M69 83H112V86H69Z')} />
      <path fill="#8f6340" d={path('M69 83H112V84H69Z')} />
      <path fill="#553c2f" d={path('M69 85H112V86H69Z')} />
    </svg>
    <svg className="scene-prop scene-laptop" viewBox={viewBox} aria-hidden="true" shapeRendering="crispEdges">
      <path fill="#304447" d={path('M88 51H114V69H112V73H83V71H84V62H86V54H88Z')} />
      <path fill="#4d6667" d={path('M90 53H112V68H110V71H86V62H88V56H90Z')} />
      <path fill="#a4cfc0" d={path('M91 55H110V67H108V69H88V62H90V56H91Z')} />
      <path fill="#dde7c9" d={path('M92 57H94V59H92ZM95 61H106V63H95ZM91 65H104V66H91Z')} />
      <path fill="#23383b" d={path('M84 71H112V73H83Z')} />
      <path fill="#304447" d={path('M83 72H112V73H110V75H108V77H106V81H73V79H75V77H77V75H80V73H83Z')} />
      <path fill="#718784" d={path('M83 73H110V74H108V76H106V79H75V78H77V76H79V74H83Z')} />
      <path fill="#405b5d" d={path('M81 74H107V75H81ZM79 76H105V77H79Z')} />
      <path fill="#9cae9f" d={path('M79 78H88V79H79Z')} />
      <path fill="#faf0d1" d={path('M113 66H117V75H113ZM117 68H120V73H117V71H118V70H117Z')} />
      <path fill="#886850" d={path('M113 66H117V68H113Z')} />
      <path fill="#d3cfad" d={path('M113 74H117V75H113Z')} />
    </svg>
  </>;
}
