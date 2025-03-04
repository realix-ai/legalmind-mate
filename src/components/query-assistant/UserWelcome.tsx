
interface UserWelcomeProps {
  userName: string;
}

const UserWelcome = ({ userName }: UserWelcomeProps) => {
  return (
    <div className="fixed bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium shadow-sm border border-border">
      <span className="text-muted-foreground mr-1">Welcome,</span> {userName}
    </div>
  );
};

export default UserWelcome;
