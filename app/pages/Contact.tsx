import { useGetAllUsers } from '@app/hooks/user/useGetAllUsers';
import { UserType } from '@app/types/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Badge } from '@app/components/ui/badge';
import { Button } from '@app/components/ui/button';
import { Mail, Shield, Users, MessageSquare } from 'lucide-react';

export const Contact = () => {
  const { users, isLoading } = useGetAllUsers();
  
  // Filter users with role.name === "admin"
  const adminUsers = users?.filter(
    (user: UserType) => user.role.name === 'admin'
  ) || [];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch with our team of administrators who are here to help you.
          </p>
        </div>

        {/* Admin Team Section */}
        <div className="mb-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading admin team...</p>
            </div>
          ) : adminUsers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminUsers.map((admin) => (
                <Card key={admin.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${admin.firstName}+${admin.lastName}&background=6366f1&color=fff&size=80`} />
                        <AvatarFallback className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                          {getInitials(admin.firstName, admin.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-xl">{admin.firstName} {admin.lastName}</CardTitle>
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {admin.role.name.charAt(0).toUpperCase() + admin.role.name.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{admin.email}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                        </Badge>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-4 hover:bg-blue-50 hover:border-blue-200"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact {admin.firstName}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-600">No admin users found in the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
