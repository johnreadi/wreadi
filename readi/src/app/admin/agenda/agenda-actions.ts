"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEvents() {
    try {
        const events = await prisma.event.findMany({
            orderBy: {
                start: 'asc'
            }
        });
        return events;
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
    }
}

export async function createEvent(data: {
    title: string;
    description?: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    location?: string;
    participantName?: string;
    participantEmail?: string;
    color?: string;
}) {
    try {
        const event = await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                start: data.start,
                end: data.end,
                allDay: data.allDay || false,
                location: data.location,
                participantName: data.participantName,
                participantEmail: data.participantEmail,
                color: data.color
            }
        });
        revalidatePath("/admin/agenda");
        return event;
    } catch (error) {
        console.error("Failed to create event:", error);
        throw error;
    }
}

export async function updateEvent(id: string, data: Partial<{
    title: string;
    description: string;
    start: Date;
    end: Date;
    allDay: boolean;
    location: string;
    participantName: string;
    participantEmail: string;
    color: string;
}>) {
    try {
        const event = await prisma.event.update({
            where: { id },
            data
        });
        revalidatePath("/admin/agenda");
        return event;
    } catch (error) {
        console.error("Failed to update event:", error);
        throw error;
    }
}

export async function deleteEvent(id: string) {
    try {
        await prisma.event.delete({
            where: { id }
        });
        revalidatePath("/admin/agenda");
    } catch (error) {
        console.error("Failed to delete event:", error);
        throw error;
    }
}
