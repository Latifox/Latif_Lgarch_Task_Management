pipeline {
    agent any
    
    tools {
        nodejs 'nodejs16'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm test'
                        }
                    }
                    post {
                        always {
                            junit 'backend/test-results/*.xml'
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test -- --watchAll=false'
                        }
                    }
                    post {
                        always {
                            junit 'frontend/test-results/*.xml'
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        dir('backend') {
                            sh 'npm run build'
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend') {
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Code Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner'
                }
            }
        }
        
        stage('Docker Build') {
            when {
                branch 'main'
            }
            steps {
                sh 'docker-compose build'
            }
        }
        
        stage('Docker Push') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                    sh 'docker push yourname/task-manager-backend:latest'
                    sh 'docker push yourname/task-manager-frontend:latest'
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'server-ssh-key', keyFileVariable: 'SSH_KEY', passphraseVariable: '', usernameVariable: 'SSH_USER')]) {
                    sh 'scp -i $SSH_KEY docker-compose.yml $SSH_USER@your-server-ip:/path/to/deployment/'
                    sh 'ssh -i $SSH_KEY $SSH_USER@your-server-ip "cd /path/to/deployment && docker-compose pull && docker-compose up -d"'
                }
            }
        }
    }
    
    post {
        success {
            echo 'Build successful! Sending notifications...'
            emailext (
                subject: "Pipeline Success: ${currentBuild.fullDisplayName}",
                body: "The build was successful. Check the results at ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }
        failure {
            echo 'Build failed! Sending notifications...'
            emailext (
                subject: "Pipeline Failed: ${currentBuild.fullDisplayName}",
                body: "The build failed. Check the results at ${env.BUILD_URL}",
                to: 'team@example.com'
            )
        }
    }
} 