package com.app.petpals.config;

import com.app.petpals.utils.SSLSocketFactoryGenerator;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class MQTTConfig {

    @Value("${MQTT_BROKER_URL}")
    private String brokerUrl;

    @Value("${MQTT_CLIENT_ID}")
    private String clientId;

    @Value("${MQTT_USERNAME}")
    private String username;

    @Value("${MQTT_PASSWORD}")
    private String password;

    @Bean
    public MqttClient mqttClient() throws MqttException {
        MqttClient client = new MqttClient(brokerUrl, clientId);
        MqttConnectOptions options = new MqttConnectOptions();
        options.setCleanSession(true);
        options.setUserName(username);
        options.setPassword(password.toCharArray());
        options.setConnectionTimeout(10);
        options.setKeepAliveInterval(60);
        options.setAutomaticReconnect(true);
        options.setSocketFactory(SSLSocketFactoryGenerator.getSocketFactory());
        client.connect(options);
        System.out.println("Connected to HiveMQ Cloud MQTT Broker: " + brokerUrl);
        return client;
    }
}
