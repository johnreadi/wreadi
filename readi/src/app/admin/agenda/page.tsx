"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, User, ChevronLeft, ChevronRight, Plus, List, Grid, Trash2 } from "lucide-react";
import { getEvents, createEvent, updateEvent, deleteEvent } from "./agenda-actions";

const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

interface Event {
    id: string;
    title: string;
    description?: string;
    start: string; // ISO string from Prisma
    end: string;
    allDay: boolean;
    location?: string;
    participantName?: string;
    participantEmail?: string;
    color?: string;
}

export default function AgendaPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'month' | 'list'>('month');
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        startTime: "09:00",
        endTime: "10:00",
        allDay: false,
        location: "",
        participantName: "",
        participantEmail: "",
        color: "blue"
    });

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        // Check URL params for new event
        const action = searchParams.get('action');
        if (action === 'new') {
            const title = searchParams.get('title') || "";
            const participant = searchParams.get('participant') || "";
            const email = searchParams.get('email') || "";
            
            setFormData(prev => ({
                ...prev,
                title,
                participantName: participant,
                participantEmail: email
            }));
            setIsEventDialogOpen(true);
        }
    }, [searchParams]);

    const loadEvents = async () => {
        setIsLoading(true);
        const data = await getEvents();
        setEvents(data as unknown as Event[]);
        setIsLoading(false);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setFormData(prev => ({
            ...prev,
            date: date.toISOString().split('T')[0]
        }));
        setSelectedEvent(null);
        setIsEventDialogOpen(true);
    };

    const handleEventClick = (event: Event, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedEvent(event);
        
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        
        setFormData({
            title: event.title,
            description: event.description || "",
            date: startDate.toISOString().split('T')[0],
            startTime: startDate.toTimeString().slice(0, 5),
            endTime: endDate.toTimeString().slice(0, 5),
            allDay: event.allDay,
            location: event.location || "",
            participantName: event.participantName || "",
            participantEmail: event.participantEmail || "",
            color: event.color || "blue"
        });
        setIsEventDialogOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

            const eventData = {
                title: formData.title,
                description: formData.description,
                start: startDateTime,
                end: endDateTime,
                allDay: formData.allDay,
                location: formData.location,
                participantName: formData.participantName,
                participantEmail: formData.participantEmail,
                color: formData.color
            };

            if (selectedEvent) {
                await updateEvent(selectedEvent.id, eventData);
            } else {
                await createEvent(eventData);
            }

            setIsEventDialogOpen(false);
            loadEvents();
            
            // Clear URL params if any
            if (searchParams.get('action')) {
                router.replace('/admin/agenda');
            }
        } catch (error) {
            console.error("Failed to save event", error);
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent || !confirm("Supprimer cet événement ?")) return;
        try {
            await deleteEvent(selectedEvent.id);
            setIsEventDialogOpen(false);
            loadEvents();
        } catch (error) {
            console.error("Failed to delete event", error);
        }
    };

    // Calendar Grid Logic
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const renderCalendarGrid = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 border bg-gray-50/50" />);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dateStr = date.toISOString().split('T')[0];
            const dayEvents = events.filter(e => e.start.startsWith(dateStr));
            const isToday = new Date().toDateString() === date.toDateString();

            days.push(
                <div 
                    key={day} 
                    className={`h-32 border p-2 transition-colors hover:bg-gray-50 cursor-pointer overflow-y-auto ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}
                    onClick={() => handleDateClick(day)}
                >
                    <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                        {day}
                    </div>
                    <div className="space-y-1">
                        {dayEvents.map(event => (
                            <div
                                key={event.id}
                                onClick={(e) => handleEventClick(event, e)}
                                className={`text-[10px] p-1 rounded truncate cursor-pointer hover:opacity-80 ${
                                    event.color === 'red' ? 'bg-red-100 text-red-700' :
                                    event.color === 'green' ? 'bg-green-100 text-green-700' :
                                    event.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}
                            >
                                {event.startTime && !event.allDay && <span className="font-bold mr-1">{new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 p-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <CalendarIcon className="h-6 w-6 text-red-600" />
                        Agenda
                    </h1>
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setView('month')}
                            className={view === 'month' ? 'bg-white shadow-sm' : ''}
                        >
                            <Grid className="h-4 w-4 mr-2" /> Mois
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setView('list')}
                            className={view === 'list' ? 'bg-white shadow-sm' : ''}
                        >
                            <List className="h-4 w-4 mr-2" /> Liste
                        </Button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
                        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="w-32 text-center font-medium">
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-red-600 hover:bg-red-700" onClick={() => {
                                setSelectedEvent(null);
                                setFormData({
                                    title: "",
                                    description: "",
                                    date: new Date().toISOString().split('T')[0],
                                    startTime: "09:00",
                                    endTime: "10:00",
                                    allDay: false,
                                    location: "",
                                    participantName: "",
                                    participantEmail: "",
                                    color: "blue"
                                });
                            }}>
                                <Plus className="h-4 w-4 mr-2" /> Nouvel événement
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{selectedEvent ? "Modifier l'événement" : "Nouvel événement"}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label>Titre</Label>
                                    <Input 
                                        value={formData.title} 
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="Réunion client..." 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Date</Label>
                                        <Input 
                                            type="date" 
                                            value={formData.date} 
                                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Couleur</Label>
                                        <Select 
                                            value={formData.color} 
                                            onValueChange={(val) => setFormData({...formData, color: val})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Couleur" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="blue">Bleu (Défaut)</SelectItem>
                                                <SelectItem value="red">Rouge (Important)</SelectItem>
                                                <SelectItem value="green">Vert (Personnel)</SelectItem>
                                                <SelectItem value="purple">Violet (Autre)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Début</Label>
                                        <Input 
                                            type="time" 
                                            value={formData.startTime} 
                                            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Fin</Label>
                                        <Input 
                                            type="time" 
                                            value={formData.endTime} 
                                            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Lieu</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input 
                                            className="pl-8" 
                                            value={formData.location} 
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                            placeholder="Salle de réunion, Zoom..." 
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label>Participant (Optionnel)</Label>
                                    <div className="relative">
                                        <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                        <Input 
                                            className="pl-8" 
                                            value={formData.participantName} 
                                            onChange={(e) => setFormData({...formData, participantName: e.target.value})}
                                            placeholder="Nom du contact" 
                                        />
                                    </div>
                                    <Input 
                                        className="mt-1" 
                                        value={formData.participantEmail} 
                                        onChange={(e) => setFormData({...formData, participantEmail: e.target.value})}
                                        placeholder="Email du contact" 
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Description</Label>
                                    <Textarea 
                                        value={formData.description} 
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        placeholder="Détails de l'événement..." 
                                    />
                                </div>
                            </div>
                            <DialogFooter className="flex justify-between sm:justify-between">
                                {selectedEvent ? (
                                    <Button variant="destructive" onClick={handleDelete}>
                                        <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                                    </Button>
                                ) : <div />}
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Annuler</Button>
                                    <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700">Enregistrer</Button>
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card className="flex-1 overflow-hidden border shadow-sm">
                {view === 'month' ? (
                    <div className="h-full flex flex-col">
                        <div className="grid grid-cols-7 border-b bg-gray-50">
                            {DAYS.map(day => (
                                <div key={day} className="p-2 text-center text-sm font-semibold text-gray-500 uppercase">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="flex-1 grid grid-cols-7 overflow-y-auto">
                            {renderCalendarGrid()}
                        </div>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto p-4 space-y-4">
                        {events.length === 0 ? (
                            <div className="text-center text-gray-400 py-10">Aucun événement prévu</div>
                        ) : (
                            events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map(event => (
                                <div 
                                    key={event.id} 
                                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer bg-white shadow-sm"
                                    onClick={(e) => handleEventClick(event, e)}
                                >
                                    <div className={`w-2 h-12 rounded-full mr-4 ${
                                        event.color === 'red' ? 'bg-red-500' :
                                        event.color === 'green' ? 'bg-green-500' :
                                        event.color === 'purple' ? 'bg-purple-500' :
                                        'bg-blue-500'
                                    }`} />
                                    <div className="flex-1">
                                        <h3 className="font-semibold">{event.title}</h3>
                                        <div className="text-sm text-gray-500 flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <CalendarIcon className="h-3 w-3" />
                                                {new Date(event.start).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                            {event.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {event.location}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {event.participantName && (
                                        <Badge variant="outline" className="ml-2">
                                            {event.participantName}
                                        </Badge>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
}
