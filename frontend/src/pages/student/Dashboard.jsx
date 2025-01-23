import {
  Box,
  Container,
  Grid,
  Heading,
  Stack,
  Card,
  CardBody,
  Text,
} from '@chakra-ui/react'

function StudentDashboard() {
  // Mock data - will be replaced with real data later
  const upcomingTasks = [
    { id: 1, title: 'Math Assignment', dueDate: '2024-02-20', course: 'Mathematics' },
    { id: 2, title: 'Physics Lab Report', dueDate: '2024-02-22', course: 'Physics' },
  ]

  const enrolledClasses = [
    { id: 1, name: 'Mathematics', teacher: 'Dr. Smith', progress: 75 },
    { id: 2, name: 'Physics', teacher: 'Prof. Johnson', progress: 60 },
    { id: 3, name: 'Computer Science', teacher: 'Mrs. Davis', progress: 85 },
  ]

  return (
    <Container maxW="container.xl" py={8}>
      <Stack spacing={8}>
        <Heading>Welcome back, Student!</Heading>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          {/* Enrolled Classes Section */}
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Your Classes</Heading>
              <Stack spacing={4}>
                {enrolledClasses.map((class_) => (
                  <Box key={class_.id} p={4} borderWidth="1px" borderRadius="lg">
                    <Text fontWeight="bold">{class_.name}</Text>
                    <Text fontSize="sm">Teacher: {class_.teacher}</Text>
                    <Text fontSize="sm">Progress: {class_.progress}%</Text>
                  </Box>
                ))}
              </Stack>
            </CardBody>
          </Card>

          {/* Upcoming Tasks Section */}
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Upcoming Tasks</Heading>
              <Stack spacing={4}>
                {upcomingTasks.map((task) => (
                  <Box key={task.id} p={4} borderWidth="1px" borderRadius="lg">
                    <Text fontWeight="bold">{task.title}</Text>
                    <Text fontSize="sm">Course: {task.course}</Text>
                    <Text fontSize="sm">Due: {task.dueDate}</Text>
                  </Box>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Stack>
    </Container>
  )
}

export default StudentDashboard 