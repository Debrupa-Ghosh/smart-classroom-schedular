const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const buildingsData = [
  {
    id: "building-1",
    name: "Building 1",
    rooms: Array.from({ length: 20 }, (_, i) => {
      const number = i + 1;
      let status = "available";
      let bookedBy = null;
      let bookedUntil = null;
      if (number === 5) {
        status = "booked";
        bookedBy = "teacher1";
        bookedUntil = "15:00";
      } else if (number === 10) {
        status = "booked";
        bookedBy = "teacher2";
        bookedUntil = "16:00";
      } else if (number % 3 === 0) {
        status = "soon";
      }
      return {
        id: `room-${number}`,
        name: `Room ${number}`,
        status,
        bookedBy,
        bookedUntil,
        timeSlot: timeSlots[i % timeSlots.length],
      };
    }),
  },
  {
    id: "building-2",
    name: "Building 2",
    rooms: Array.from({ length: 20 }, (_, i) => {
      const number = i + 1;
      let status = "available";
      let bookedBy = null;
      let bookedUntil = null;
      if (number === 4) {
        status = "booked";
        bookedBy = "teacher1";
        bookedUntil = "14:00";
      } else if (number === 12) {
        status = "booked";
        bookedBy = "teacher2";
        bookedUntil = "15:30";
      } else if (number % 6 === 0) {
        status = "soon";
      }
      return {
        id: `room-${number}`,
        name: `Room ${number}`,
        status,
        bookedBy,
        bookedUntil,
        timeSlot: timeSlots[i % timeSlots.length],
      };
    }),
  },
  {
    id: "building-3",
    name: "Building 3",
    rooms: Array.from({ length: 20 }, (_, i) => ({
      id: `room-${i + 1}`,
      name: `Room ${i + 1}`,
      status: "available",
      bookedBy: null,
      bookedUntil: null,
      timeSlot: timeSlots[i % timeSlots.length],
    })),
  },
  {
    id: "building-4",
    name: "Building 4",
    rooms: Array.from({ length: 20 }, (_, i) => ({
      id: `room-${i + 1}`,
      name: `Room ${i + 1}`,
      status: "soon",
      bookedBy: null,
      bookedUntil: null,
      timeSlot: timeSlots[i % timeSlots.length],
    })),
  },
  {
    id: "building-5",
    name: "Building 5",
    rooms: Array.from({ length: 20 }, (_, i) => ({
      id: `room-${i + 1}`,
      name: `Room ${i + 1}`,
      status: "available",
      bookedBy: null,
      bookedUntil: null,
      timeSlot: timeSlots[i % timeSlots.length],
    })),
  },
];
