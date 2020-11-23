import React from 'react';
import Renderer3D from './Renderer3D';
import s from './Galery.scss'

const Galery = () => {
  const galeryRef = React.useRef(null);

  React.useEffect(() => {
    if (RUNTIME_ENV === 'client') {
      const ImgGalery = new Renderer3D(galeryRef.current);
      console.log(ImgGalery);
    }
  }, [galeryRef])
  return <div className={s.root} ref={galeryRef} />
};

export default Galery;