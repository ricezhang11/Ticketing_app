import { Publisher, OrderCreatedEvent, Subjects } from '@azmytickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
