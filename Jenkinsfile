// pipeline {
//     agent any

//     environment {
//         MONGODB_URI = 'mongodb+srv://yadav28rahul10:kutta12@cluster0.nqioiwi.mongodb.net/BlogDB'
//     }

//     stages {
//         stage('Stop Existing Container') {
//             steps {
//                 script {
//                     sh '''
//                         docker-compose down || true
//                         docker stop blogsphere-backend || true
//                         docker rm blogsphere-backend || true
//                     '''
//                 }
//             }
//         }

//         stage('Build & Deploy') {
//             steps {
//                 script {
//                     sh 'docker-compose up -d --build'
//                     sh 'sleep 15' // Increased wait time
//                 }
//             }
//         }

//         stage('Verify Deployment') {
//             steps {
//                 script {
//                     // More robust health check
//                     sh '''
//                         container_id=$(docker ps -qf "name=blogsphere-backend")
//                         if [ -z "$container_id" ]; then
//                             echo "Container not running!"
//                             docker logs blogsphere-backend || true
//                             exit 1
//                         fi
                        
//                         # Check if port is responding
//                         if ! nc -z localhost 3001; then
//                             echo "Port 3001 not responding!"
//                             docker logs blogsphere-backend
//                             exit 1
//                         fi
                        
//                         # Try hitting the endpoint
//                         if ! curl -sSf --retry 5 --retry-delay 5 http://localhost:3001/health; then
//                             echo "Health check failed!"
//                             docker logs blogsphere-backend
//                             exit 1
//                         fi
//                     '''
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             cleanWs()
//         }
//         success {
//             echo '✅ Deployment successful!'
//         }
//         failure {
//             echo '❌ Deployment failed!'
//             script {
//                 sh 'docker logs blogsphere-backend || true'
//             }
//         }
//     }
// }
pipeline {
    agent any

    tools {
        nodejs "node"  // Make sure this tool is configured in Jenkins
    }

    environment {
        IMAGE_NAME = 'blogsphere-backend'
        CONTAINER_NAME = 'blogsphere-container'
        APP_PORT = '3001'
        MONGODB_URI = 'mongodb+srv://yadav28rahul10:kutta12@cluster0.nqioiwi.mongodb.net/BlogDB'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/Rahul01Kumar/BlogSphere.git',
                credentialsId: 'github-credentials'  // Add Jenkins credentials for private repo
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm ci --silent'  // Clean install for consistency
                }
            }
        }

        stage('Verify Environment') {
            steps {
                script {
                    // Verify Node.js and Docker are available
                    sh 'node --version'
                    sh 'npm --version'
                    sh 'docker --version'
                    
                    // Verify backend files exist
                    sh 'test -f backend/server.js || (echo "server.js missing" && exit 1)'
                    sh 'test -f backend/package.json || (echo "package.json missing" && exit 1)'
                }
            }
        }

        stage('Prepare Configuration') {
            steps {
                script {
                    // Create .env file with all required variables
                    writeFile file: 'backend/.env', text: """
                    PORT=${APP_PORT}
                    MONGODB_URI=${MONGODB_URI}
                    NODE_ENV=production
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build with cache management
                    sh "docker build --no-cache -t ${IMAGE_NAME} ."
                    
                    // Verify image was created
                    sh "docker image inspect ${IMAGE_NAME} >/dev/null 2>&1 || (echo 'Image build failed' && exit 1)"
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    // Clean up any existing container
                    sh "docker rm -f ${CONTAINER_NAME} || true"
                    
                    // Run container with health check
                    sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p ${APP_PORT}:${APP_PORT} \
                        --health-cmd="curl -f http://localhost:${APP_PORT}/health || exit 1" \
                        --health-interval=5s \
                        --health-retries=3 \
                        ${IMAGE_NAME}
                    """
                    
                    // Wait for container to become healthy
                    timeout(time: 2, unit: 'MINUTES') {
                        sh """
                        while [ "\$(docker inspect -f '{{.State.Health.Status}}' ${CONTAINER_NAME})" != "healthy" ]; do
                            sleep 5
                            echo "Waiting for container to become healthy..."
                        done
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            // Capture logs if available
            script {
                sh "docker logs ${CONTAINER_NAME} || true"
            }
        }
        success {
            echo "✅ Success! Application running on port ${APP_PORT}"
            sh "curl -s http://localhost:${APP_PORT}/health"
        }
        failure {
            echo "❌ Deployment failed"
            // Clean up resources
            sh "docker rm -f ${CONTAINER_NAME} || true"
            sh "docker rmi ${IMAGE_NAME} || true"
        }
        cleanup {
            cleanWs()  // Clean workspace
        }
    }
}