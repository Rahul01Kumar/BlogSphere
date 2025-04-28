pipeline {
    agent any

    environment {
        MONGODB_URI = 'mongodb+srv://yadav28rahul10:kutta12@cluster0.nqioiwi.mongodb.net/BlogDB'
    }

    stages {
        stage('Stop Existing Container') {
            steps {
                script {
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
                    sh 'docker-compose up -d --build'
                    sh 'sleep 15' // Increased wait time
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    // More robust health check
                    sh '''
                        container_id=$(docker ps -qf "name=blogsphere-backend")
                        if [ -z "$container_id" ]; then
                            echo "Container not running!"
                            docker logs blogsphere-backend || true
                            exit 1
                        fi
                        
                        # Check if port is responding
                        if ! nc -z localhost 3001; then
                            echo "Port 3001 not responding!"
                            docker logs blogsphere-backend
                            exit 1
                        fi
                        
                        # Try hitting the endpoint
                        if ! curl -sSf --retry 5 --retry-delay 5 http://localhost:3001/health; then
                            echo "Health check failed!"
                            docker logs blogsphere-backend
                            exit 1
                        fi
                    '''
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
            script {
                sh 'docker logs blogsphere-backend || true'
            }
        }
    }
}