const Event = require('../../models/event');
const Booking = require('../../models/booking');
const { transformEvent, transformBooking } = require('./merge');



module.exports =  {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("User is unauthenticated!");
        }
        try {
            const bookings = await Booking.find({user: req.userId});
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (err){
            throw err;
        }
    },

    // Create Booking
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("User is unauthenticated!");
        }
        try {
            const fetchedEvent = await Event.findOne({_id: args.eventId})
            const booking = await new Booking({
                user: req.userId,
                event: fetchedEvent
            })
            const result = await booking.save();
            return transformBooking(result);
        } catch (error) {
            throw error;
        }
    },
    cancelBooking: async (args, req) => {
        // if (!req.isAuth) {
        //   throw new Error('Unauthenticated!');
        // }
        try {
          const booking = await Booking.findById(args.bookingId).populate('events');
          console.log("BOOKING", booking);
          const event = transformEvent(booking.event);
          await Booking.deleteOne({ _id: args.bookingId });
          console.log("EVENT", event);
          return event;
        } catch (err) {
          throw err;
        }
      }
}