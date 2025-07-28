import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@app/components/ui/avatar';
import { Badge } from '@app/components/ui/badge';
import { Button } from '@app/components/ui/button';
import { Mail, Shield, Users, MessageSquare, Phone } from 'lucide-react';
import { useGetAllAdmins } from '@app/hooks/user/useGetAllAdmins';

export const Contact = () => {
  const { admins, isLoading } = useGetAllAdmins();

  if (!admins) {
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-primary text-3xl">Failed to load admins</h1>
    </div>;
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="h-full bg-gray-100 p-6">
      <div className="mx-4 mt-4 mb-16 max-w-7xl md:mx-4 lg:mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-foreground mb-2 text-3xl font-bold">Contact us</h1>
          <p className="text-muted-foreground">
            Get in touch with our team of administrators who are here to help you.
          </p>
        </div>

        {/* Admin Team Section */}
        <div className="mb-8">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="border-primary/30 mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground mt-4">Loading admin team...</p>
            </div>
          ) : admins?.length === 0 ? (
            <div className="py-12 text-center">
              <div className="bg-primary mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full p-6">
                <Users className="text-secondary size-12" />
              </div>
              <p className="text-muted-foreground">No admin users found in the system.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {admins?.map((admin) => (
                <Card
                  key={admin.id}
                  className="border-0 shadow-lg transition-shadow duration-300 hover:shadow-xl"
                >
                  <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${admin.firstName}+${admin.lastName}&background=6366f1&color=fff&size=80`}
                        />
                        <AvatarFallback className="bg-primary text-lg font-semibold text-white">
                          {getInitials(admin.firstName, admin.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <CardTitle className="text-xl">
                      {admin.firstName} {admin.lastName}
                    </CardTitle>

                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Shield className="size-4" />
                        {admin.role.name.charAt(0).toUpperCase() + admin.role.name.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="mx-2 space-y-2">
                    <div className="text-muted-foreground flex items-center justify-start gap-2">
                      <Mail className="size-4" />
                      <span className="text-sm">{admin.email}</span>
                    </div>

                    <div className="text-muted-foreground flex items-center justify-start gap-2">
                      <Phone className="size-4" />
                      <span className="text-sm">{admin.phoneNumber}</span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button size="sm" className="w-full" asChild>
                      <a href={'mailto:' + admin.email}>
                        <MessageSquare className="mr-2 size-4" />
                        Contact {admin.firstName}
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
