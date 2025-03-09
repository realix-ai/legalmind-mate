
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const AdminDashboard = () => {
  const { getAllUsers } = useAuth();
  const registeredUsers = getAllUsers();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container pt-24 pb-10">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="card bg-background rounded-lg shadow border p-6">
          <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
          {registeredUsers.length === 0 ? (
            <p className="text-muted-foreground">No users have registered yet.</p>
          ) : (
            <>
              <p className="mb-4 text-muted-foreground">Total registrations: {registeredUsers.length}</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registration Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registeredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono">{user.id}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(parseInt(user.id)).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
