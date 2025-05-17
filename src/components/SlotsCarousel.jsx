import React from "react";
import { Carousel } from "react-bootstrap";


function SlotsCarousel(props) {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://parking.ecu.edu/wp-content/pv-uploads/sites/379/2020/08/D-Zone-Parking-768x525.jpg"
          alt="Parking Area Map 1"
          style={{ height: "600px", objectFit: "cover" }}
        />
        <Carousel.Caption>
          <h3>Overall Map</h3>
          <p>All parking areas</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://thumbs.dreamstime.com/b/car-parking-lot-road-markings-numbering-spaces-empty-pedestrian-crossing-top-view-d-render-153672294.jpg"
          alt="Parking Area Map 2"
          style={{ height: "600px", objectFit: "cover" }}
        />
        <Carousel.Caption>
          <h3>Level 1 Parking</h3>
          <p>Upper level parking area</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="https://thumbs.dreamstime.com/b/car-parking-lot-road-markings-numbering-spaces-empty-pedestrian-crossing-top-view-d-render-153672294.jpg"
          alt="Parking Area Map 3"
          style={{ height: "600px", objectFit: "cover" }}
        />
        <Carousel.Caption>
          <h3>Level 2 Parking</h3>
          <p>Basement parking area</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default SlotsCarousel;
