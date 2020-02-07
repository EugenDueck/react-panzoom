import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';

import positionFromEvent from '../helpers/positionFromEvent';

import './Element.css';

const Element = ({ children, x, y }) => {
  const [moving, setMoving] = useState(null);
  const elementRef = useRef();

  useLayoutEffect(() => {
    elementRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, [x, y]);

  useEffect(() => {
    if (!moving) return undefined;

    const mousemove = (e) => {
      const eventPosition = positionFromEvent(e);
      const translate = {
        x: eventPosition.clientX - moving.x,
        y: eventPosition.clientY - moving.y,
      };

      elementRef.current.style.transform = `translate(${translate.x}px, ${translate.y}px)`;
    };

    window.addEventListener('mousemove', mousemove);

    return () => {
      window.removeEventListener('mousemove', mousemove);
    };
  }, [moving]);

  const mousedown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const eventPosition = positionFromEvent(e);
    const rect = elementRef.current.getBoundingClientRect();
    setMoving({
      x: eventPosition.clientX - rect.left,
      y: eventPosition.clientY - rect.top,
    });
  };

  useLayoutEffect(() => {
    elementRef.current.addEventListener('mousedown', mousedown);
    return () => {
      elementRef.current.removeEventListener('mousedown', mousedown);
    };
  }, []);

  return (
    <div ref={elementRef} className="react-panzoom-element">
      {children}
    </div>
  );
};

Element.propTypes = {
  children: PropTypes.node.isRequired,
  x: PropTypes.number,
  y: PropTypes.number,
};

Element.defaultProps = {
  x: 0,
  y: 0,
};

export default Element;
