pipeline {
    agent any

    environment {
        // Hardcoded MongoDB URI (not recommended for production)
        MONGODB_URI = 'mongodb+srv://yadav28rahul10:kutta12@cluster0.nqioiwi.mongodb.net/BlogDB'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo/BlogSphere.git'
            }
        }

        stage('Stop Existing Container') {
            steps {
                script {
                    // Gracefully stop and remove old container if running
                    sh '''
                        docker-compose down || true
                        docker stop blogsphere-backend || true
                        docker rm blogsphere-backend || true
                    '''
                }
            }
        }

        stage('Build & Deploy') {
            steps {
                script {
                    // Build and start using docker-compose
                    sh 'docker-compose up -d --build'
                    
                    // Verify container is running
                    sh 'docker ps --filter "name=blogsphere-backend" --format "{{.Status}}" | grep -q "Up"'
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    // Check if the app is responding (adjust URL/port as needed)
                    sh 'curl --retry 5 --retry-delay 10 --retry-all-errors http://localhost:3001/health'
                }
            }
        }
    }

    post {
        always {
            cleanWs()  // Clean workspace
        }
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
            // Optional: Send failure notification (Slack/Email)
        }
    }
}