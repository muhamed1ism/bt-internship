export class CreateTeamDto {
  name: string;

  clientName: string;

  projectDescription: string;

  documentation: string;

  githubLink: string;

  startDate: Date;

  technologies: string[];
}
