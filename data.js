const buildingsData = [
  {
    id: "building-1",
    name: "Building A",
    rooms: Array.from({ length: 20 }, (_, i) => {
      const number = i + 1;
      let status = "available";
      let bookedBy = null;
      let bookedUntil = null;
      // Pre-book some rooms only by teacher1 or teacher2
      if (number === 5) {
        status = "booked";
        bookedBy = "teacher1";
        bookedUntil = "3:00 PM";
      } else if (number === 10) {
        status = "booked";
        bookedBy = "teacher2";
        bookedUntil = "4:00 PM";
      } else if (number % 3 === 0) {
        status = "soon";
      }
      return {
        id: `room-${number}`,
        name: `Room ${number}`,
        status,
        bookedBy,
        bookedUntil,
      };
    }),
  },
  {
    id: "building-2",
    name: "Building B",
    rooms: Array.from({ length: 20 }, (_, i) => {
      const number = i + 1;
      let status = "available";
      let bookedBy = null;
      let bookedUntil = null;
      if (number === 4) {
        status = "booked";
        bookedBy = "teacher1";
        bookedUntil = "2:00 PM";
      } else if (number === 12) {
        status = "booked";
        bookedBy = "teacher2";
        bookedUntil = "3:30 PM";
      } else if (number % 6 === 0) {
        status = "soon";
      }
      return {
        id: `room-${number}`,
        name: `Room ${number}`,
        status,
        bookedBy,
        bookedUntil,
      };
    }),
  },
  // The other buildings start with all rooms available or soon
  {
    id: "building-3",
    name: "Building C",
    rooms: Array.from({ length: 20 }, (_, i) => ({
      id: `room-${i + 1}`,
      name: `Room ${i + 1}`,
      status: "available",
      bookedBy: null,
      bookedUntil: null,
    })),
  },
  {
    id: "building-4",
    name: "Building D",
    rooms: Array.from({ length: 20 }, (_, i) => ({
      id: `room-${i + 1}`,
      name: `Room ${i + 1}`,
      status: "soon",
      bookedBy: null,
      bookedUntil: null,
    })),
  },
  {
    id: "building-5",
    name: "Building E",
    rooms: Array.from({ length: 20 }, (_, i) => ({
      id: `room-${i + 1}`,
      name: `Room ${i + 1}`,
      status: "available",
      bookedBy: null,
      bookedUntil: null,
    })),
  },
];
