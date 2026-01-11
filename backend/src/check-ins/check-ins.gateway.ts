import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CheckInsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private eventRooms: Map<string, Set<string>> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove client from all event rooms
    this.eventRooms.forEach((clients, eventId) => {
      clients.delete(client.id);
      if (clients.size === 0) {
        this.eventRooms.delete(eventId);
      }
    });
  }

  @SubscribeMessage('joinEvent')
  handleJoinEvent(client: Socket, eventId: string) {
    client.join(`event-${eventId}`);
    
    if (!this.eventRooms.has(eventId)) {
      this.eventRooms.set(eventId, new Set());
    }
    this.eventRooms.get(eventId)?.add(client.id);
    
    console.log(`Client ${client.id} joined event ${eventId}`);
    return { success: true, message: `Joined event ${eventId}` };
  }

  @SubscribeMessage('leaveEvent')
  handleLeaveEvent(client: Socket, eventId: string) {
    client.leave(`event-${eventId}`);
    
    const room = this.eventRooms.get(eventId);
    if (room) {
      room.delete(client.id);
      if (room.size === 0) {
        this.eventRooms.delete(eventId);
      }
    }
    
    console.log(`Client ${client.id} left event ${eventId}`);
    return { success: true, message: `Left event ${eventId}` };
  }

  // Emit check-in event to all clients in the event room
  emitCheckIn(eventId: string, checkInData: any) {
    this.server.to(`event-${eventId}`).emit('newCheckIn', checkInData);
  }

  // Emit statistics update to all clients in the event room
  emitStatisticsUpdate(eventId: string, statistics: any) {
    this.server.to(`event-${eventId}`).emit('statisticsUpdate', statistics);
  }
}
