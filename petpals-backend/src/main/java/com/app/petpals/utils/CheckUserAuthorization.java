package com.app.petpals.utils;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CheckUserAuthorization {
    String idField() default "userId";

    String pathVariable() default "";

    String requestParam() default "";
}
