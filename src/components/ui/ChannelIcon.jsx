import { Mail, Globe, MessageCircle, Phone } from 'lucide-react';

const MAP = {
  email: Mail,
  web: Globe,
  chat: MessageCircle,
  phone: Phone,
};

export default function ChannelIcon({ channel, size = 14, className = 'text-gray-400' }) {
  const Icon = MAP[channel] || Globe;
  return <Icon size={size} strokeWidth={1.5} className={className} />;
}
